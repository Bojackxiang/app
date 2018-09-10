import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';
import {CookieService} from 'ngx-cookie';

import {RestResponse} from '../object/rest-response';
import {CartItem} from '../object/cart-item';
import {Ticket} from '../object/ticket';
import {TicketType} from '../object/ticket-type';

import {Lang} from '../setting/lang';
import {Setting} from '../setting/setting';

@Injectable()
export class CartData {
  private cartUrl = Setting.API_BASE + Setting.API_CART;  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService,
              private cookieService: CookieService) {
  }

  getCart(cartCode: string): Observable<RestResponse> {
    return this.http.get(`${this.cartUrl}/${cartCode}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  updateCartItem(data: any): Observable<RestResponse> {
    return this.http.post(this.cartUrl, JSON.stringify(data), {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  deleteCartItem(data: any): Observable<RestResponse> {
    // let data = {
    //   "itemCartCode" : cartCode,
    //   "itemId" : cartItem.itemId
    // }
    return this.http.post(this.cartUrl, JSON.stringify(data), {headers: this.headers, method: "DELETE"})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  deleteCart(cartCode: string): Observable<RestResponse> {
    return this.http.post(`${this.cartUrl}/${cartCode}`, null, {headers: this.headers, method: "DELETE"})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }
}
