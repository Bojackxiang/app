import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {UserData} from '../../data/user.data';

import {RestResponse} from '../../object/rest-response';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'user-email',
  templateUrl: './user-email.component.html',
})
export class UserEmailComponent implements OnInit {
  linkExpire: boolean;
  userCode: string;
  userEmailConfirmNonce: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cookieService: CookieService,
              private userData: UserData) {
  }

  ngOnInit(): void {
    this.route.queryParams.forEach((params: Params) => {
      this.userCode = params['userCode'];
      this.userEmailConfirmNonce = params['userEmailConfirmNonce'];
    });

    if (!this.userCode || !this.userEmailConfirmNonce) {
      this.noticeService.setNotice('链接错误！', [{
        id: 'notice-link-default'
      }]);
      return;
    }
    const data = {
      userCode: this.userCode,
      userEmailConfirmNonce: this.userEmailConfirmNonce
    };
    this.userData.emailConfirmation(data)
      .subscribe(response => this.handleEmailConfirmation(response),
        err => this.responseService.handleResponse(err));

  }

  handleEmailConfirmation(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice('验证成功！账号现可登陆！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4000:
        this.noticeService.setNotice('链接错误！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4025:
        this.linkExpire = true;
        break;
      case 4024:
      case 4027:
        this.responseService.handleResponse(response);
        break;
      default:
        this.noticeService.setNotice(Lang.CN.SystemError, [{
          id: 'notice-link-default'
        }]);
        break;
    }
  }

  resend(): void {
    this.userData.emailConfirmationRequest(this.userCode)
      .subscribe(response => this.handleEmailConfirmationRequest(response),
        err => this.responseService.handleResponse(err));

  }

  handleEmailConfirmationRequest(response: RestResponse): void {
    switch (response.code) {
      case 2400:
        this.noticeService.setNotice('认证邮件已重新发送！', [{
          id: 'notice-link-default'
        }]);
        break;
      default:
        this.responseService.handleResponse(response);
        break;
    }

  }
}
