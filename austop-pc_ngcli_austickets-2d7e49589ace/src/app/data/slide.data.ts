import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

@Injectable()
export class SlideData {
  private SlideUrl = Setting.API_BASE + Setting.API_SLIDER;  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService) {
  }

  getSlides(slideCode: string): Observable<RestResponse> {
    return this.http.get(`${this.SlideUrl}/${slideCode}`)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }
}
