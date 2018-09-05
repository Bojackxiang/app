import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import * as sha1 from 'js-sha1';

import {ResponseService} from '../service/response.service';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

@Injectable()
export class EventData {
  private eventUrl = Setting.API_BASE + Setting.API_EVENT;  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService,) {
  }

  getEvents(param: string): Observable<RestResponse> {
    return this.http.get(`${this.eventUrl}/?${param}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getEvent(eventCode: string): Observable<RestResponse> {
    return this.http.get(`${this.eventUrl}/${eventCode}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getCategoryEvents(categoryName: string, page: number, size: number): Observable<RestResponse> {
    const categoryNameSalt = sha1(categoryName);
    return this.http.get(
      `${this.eventUrl}/categoryevents/?categoryName=${categoryNameSalt}&page=${page}&size=${size}`, new RequestOptions({headers: this.headers}))
      .map(this.responseService.result)
      .catch(this.responseService.error);
  }
}
