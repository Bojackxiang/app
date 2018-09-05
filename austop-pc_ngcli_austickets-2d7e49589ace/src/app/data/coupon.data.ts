import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

@Injectable()
export class CouponData {
  private CouponUrl = Setting.API_BASE + Setting.API_COUPON;  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService) {
  }

  getCoupon(couponCode: string): Observable<RestResponse> {
    return this.http.get(`${this.CouponUrl}/${couponCode}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }
}
