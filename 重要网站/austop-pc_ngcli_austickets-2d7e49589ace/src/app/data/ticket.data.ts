import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

import * as sha1 from 'js-sha1';

@Injectable()
export class TicketData {
  private ticketUrl = Setting.API_BASE + Setting.API_TICKET;  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService) {
  }

  getTickets(param: string): Observable<RestResponse> {
    return this.http.get(`${this.ticketUrl}/?${param}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getTicket(ticketCode: string): Observable<RestResponse> {
    return this.http.get(`${this.ticketUrl}/${ticketCode}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getCategoryTickets(categoryName: string, page: number, size: number): Observable<RestResponse> {
    const categoryNameSalt = sha1(categoryName);
    return this.http.get(
      `${this.ticketUrl}/categorytickets?categoryName=${categoryNameSalt}&page=${page}&size=${size}`, new RequestOptions({headers: this.headers}))
      .map(this.responseService.result)
      .catch(this.responseService.error);
  }
}
