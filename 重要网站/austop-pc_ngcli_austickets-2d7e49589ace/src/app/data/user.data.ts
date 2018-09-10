import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {ResponseService} from '../service/response.service';
import {CookieService} from 'ngx-cookie';

import {RestResponse} from '../object/rest-response';

import {Setting} from '../setting/setting';

@Injectable()
export class UserData {
  private userUrl = Setting.API_BASE + Setting.API_USER;  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private responseService: ResponseService,
              private cookieService: CookieService) {
  }

  login(data: any): Observable<RestResponse> {
    // let data =   {
    //     'userEmail' : userEmail,
    //     'userPassword' : userPassword
    // };
    return this.http.post(`${this.userUrl}/login`, JSON.stringify(data), {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  logoff(userCode: string): Observable<RestResponse> {
    const authHeaders = new Headers({
      'Authorization': 'Bearer ' + this.cookieService.get('userAccessToken')
    });

    return this.http.post(`${this.userUrl}/${userCode}/logout`, null, {headers: authHeaders})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  register(data: any): Observable<RestResponse> {
    // let data = {
    //             'userEmail' : userEmail,
    //             'userPassword' : userPassword,
    //             'emailSubscription': true
    //           };

    return this.http.post(`${this.userUrl}`, JSON.stringify(data), {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getUser(userCode: string): Observable<RestResponse> {
    const authHeaders = new Headers({
      'Authorization': 'Bearer ' + this.cookieService.get('userAccessToken')
    });
    return this.http.get(`${this.userUrl}/${userCode}`, {headers: authHeaders})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  updateUser(userCode: string, data: any): Observable<RestResponse> {
    const authHeaders = new Headers({
      'Authorization': 'Bearer ' + this.cookieService.get('userAccessToken')
    });
    return this.http.post(`${this.userUrl}/${userCode}`, data, {headers: authHeaders})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  passwordResetRequest(data: any): Observable<RestResponse> {
    // data = {
    //   'resetEmail' : resetEmail,
    // }
    return this.http.post(`${this.userUrl}/passwordresetrequest`, data, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  passwordResetCheck(data: any): Observable<RestResponse> {
    // data = {
    //   'resetEmailSalt' : resetEmailSalt,
    //   'resetNonce' : resetNonce
    // }
    return this.http.post(`${this.userUrl}/passwordresetcheck`, data, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  passwordReset(data: any): Observable<RestResponse> {
    // data = {
    //   'resetEmailSalt' : resetEmailSalt,
    //   'resetNonce' : resetNonce
    // }
    return this.http.post(`${this.userUrl}/passwordreset`, data, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  emailConfirmation(data: any): Observable<RestResponse> {
    // data = {
    //   'userCode' : userCode,
    //   'userEmailConfirmNonce' : userEmailConfirmNonce
    // }
    return this.http.post(`${this.userUrl}/emailconfirmation`, data, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  emailConfirmationRequest(userCode: string): Observable<RestResponse> {
    return this.http.post(`${this.userUrl}/emailconfirmation/${userCode}`, null, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  unsubscription(userCode: string): Observable<RestResponse> {
    return this.http.post(`${this.userUrl}/unsubscription/${userCode}`, null, {headers: this.headers})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  updateUserPassword(userCode: string, data: any): Observable<RestResponse> {
    const authHeaders = new Headers({
      'Authorization': 'Bearer ' + this.cookieService.get('userAccessToken')
    });
    return this.http.post(`${this.userUrl}/${userCode}/password`, data, {headers: authHeaders})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }

  getOrders(userCode: string): Observable<RestResponse> {
    const authHeaders = new Headers({
      'Authorization': 'Bearer ' + this.cookieService.get('userAccessToken')
    });
    return this.http.get(`${this.userUrl}/${userCode}/orders?page=1&size=100`, {headers: authHeaders})
      .map(response => this.responseService.result(response))
      .catch(err => this.responseService.error(err));
  }
}
