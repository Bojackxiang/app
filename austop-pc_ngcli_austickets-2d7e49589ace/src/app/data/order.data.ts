import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';
import {CookieService} from 'ngx-cookie';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

@Injectable()
export class OrderData {
  private orderUrl = Setting.API_BASE + Setting.API_ORDER;  // URL to web api
  private pickUpUrl = Setting.API_BASE + Setting.API_PICKUP;
  private deliveryUrl = Setting.API_BASE + Setting.API_DELIVERY;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService,
              private cookieService: CookieService) {
  }

  createOrder(data: any): Observable<RestResponse> {
    const authHeaders = new Headers({
      'Authorization': 'Bearer ' + this.cookieService.get('userAccessToken')
    });

    return this.http.post(this.orderUrl, JSON.stringify(data), {headers: authHeaders})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  payOrder(orderCode: string, methodCode: string): Observable<RestResponse> {
    return this.http.post(this.orderUrl + '/' + orderCode + Setting.API_PAYMENT_METHOD + '/' + methodCode, null, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getOrder(orderCode: string): Observable<RestResponse> {
    const authHeaders = new Headers({
      'Authorization': 'Bearer ' + this.cookieService.get('userAccessToken')
    });
    return this.http.get(`${this.orderUrl}/${orderCode}`, {headers: authHeaders})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getPickUp(): Observable<RestResponse> {
    return this.http.get(`${this.pickUpUrl}`, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getDelivery(): Observable<RestResponse> {
    return this.http.get(`${this.deliveryUrl}`, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }
}
