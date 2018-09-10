import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

@Injectable()
export class GiftcardData {
  private giftcardUrl = Setting.API_BASE + Setting.API_GIFTCARD;  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService,) {
  }

  getGiftcard(giftcardCode: string): Observable<RestResponse> {
    return this.http.get(`${this.giftcardUrl}/${giftcardCode}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }
}
