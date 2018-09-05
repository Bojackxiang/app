import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';
import {Observable} from 'rxjs/Observable';
import {ResponseService} from '../service/response.service';

@Injectable()
export class PickupData {
  private headers = new Headers({'Content-Type': 'application/json'});
  private pickupUrl = `${Setting.API_BASE}/pickuppoints`;

  constructor(private http: Http,
              private responseService: ResponseService) {
  }

  /**
   * List pickup points
   *
   * @return {Observable<R|T>}
   */
  listPickups(): Observable<RestResponse> {
    return this.http.get(this.pickupUrl)
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }
}
