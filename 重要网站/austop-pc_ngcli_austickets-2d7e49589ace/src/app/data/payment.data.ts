import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';

import {RestResponse} from '../object/rest-response';
import {PaymentStripe} from '../object/payment-stripe';

import {Setting} from '../setting/setting';

@Injectable()
export class PaymentData {
  private paymentMethodUrl = Setting.API_BASE + Setting.API_PAYMENT_METHOD;  // URL to web api
  private paymentUrl = Setting.API_BASE + Setting.API_PAYMENT;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService) {
  }

  getPayments(): Observable<RestResponse> {
    return this.http.get(`${this.paymentMethodUrl}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  createWechat(orderCode: string): Observable<RestResponse> {
    return this.http.post(`${this.paymentUrl}/omipay/wechatpay/orders/${orderCode}?source=${Setting.CLIENT_TYPE.PC}`, null, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getWechat(paymentCode: string): Observable<RestResponse> {
    return this.getOmipay(paymentCode);
  }

  getStripePublicClientKey(): Observable<RestResponse> {
    return this.http.get(`${this.paymentUrl}/card/clientkey`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error((err)));
  }

  createStripePayment(orderCode: string, stripeToken: string): Observable<RestResponse> {
    const stripePayment = new PaymentStripe();
    stripePayment.paymentToken = stripeToken;
    return this.http.post(`${this.paymentUrl}/card/orders/${orderCode}/create`, JSON.stringify(stripePayment), {
      'headers': this.headers
    })
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  createAlipay(orderCode: string): Observable<RestResponse> {
    return this.http.post(`${this.paymentUrl}/omipay/alipay/orders/${orderCode}?source=${Setting.CLIENT_TYPE.PC}`, null, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getAlipay(paymentCode: string) {
    return this.getOmipay(paymentCode);
  }

  private getOmipay(paymentCode: string) {
    return this.http.get(`${this.paymentUrl}/omipay/${paymentCode}`, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  createUnionPay(orderCode: string): Observable<RestResponse> {
    return this.http.post(`${this.paymentUrl}/unionpay/orders/${orderCode}`, null, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  manualUpdateUnionPay(paymentCode: string): Observable<RestResponse> {
    return this.http.put(`${this.paymentUrl}/unionpay/${paymentCode}`, null, {headers: this.headers})
      .map(this.responseService.result)
      .catch(this.responseService.error);
  }
}
