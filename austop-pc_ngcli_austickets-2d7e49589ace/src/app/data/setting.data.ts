import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';

import {RestResponse} from '../object/rest-response';
import {SiteSetting} from '../object/site-setting';

import {Setting} from '../setting/setting';

@Injectable()
export class SettingData {
    private headers = new Headers({'Content-Type': 'application/json'});
    private url = `${Setting.API_BASE}/settings`;

    constructor(private http: Http,
                private responseService: ResponseService) {

    }

    listByRoot(root: string): Observable<RestResponse> {
        return this.http.get(`${this.url}/root/${root}`, new RequestOptions({headers: this.headers}))
            .map(this.responseService.result).catch(this.responseService.error);
    }
}