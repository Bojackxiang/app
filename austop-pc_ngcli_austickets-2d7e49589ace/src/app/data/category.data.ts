import {Injectable} from '@angular/core';

import {Http, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import {ResponseService} from '../service/response.service';
import {CookieService} from 'ngx-cookie';
import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

@Injectable()
export class CategoryData {

    private categoryUrl = `${Setting.API_BASE}/categories`;
    
    constructor(private http: Http,
                private responseService: ResponseService,
                private cookieService: CookieService) {

    }

    listTicketCats(): Observable<RestResponse> {
        return this.listTypeCats('ticketcategories');
    }

    listEventCats(): Observable<RestResponse> {
        return this.listTypeCats('eventcategories');
    }

    private listTypeCats(type: string): Observable<RestResponse> {
        return this.http.get(`${this.categoryUrl}/${type}`, new RequestOptions({headers: this.getHeaders()}))
            .map(this.responseService.result)
            .catch(this.responseService.error);
    }

    private getHeaders(): Headers {
        return new Headers({'Content-Type': 'application/json'});
    }
}
