import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {UserData} from '../../data/user.data';

import {RestResponse} from '../../object/rest-response';
import {UserPassword} from '../../object/user-password';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'user-password',
  styleUrls: ['./user-password.component.css'],
  templateUrl: './user-password.component.html',
})
export class UserPasswordComponent implements OnInit {
  userPassword: UserPassword;
  resetEmailSalt: string;
  resetNonce: number;
  userNewPasswordCheck: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private noticeService: NoticeService,
              private cookieService: CookieService,
              private responseService: ResponseService,
              private userData: UserData) {
  }

  ngOnInit(): void {
    this.route.queryParams.forEach((params: Params) => {
      this.resetEmailSalt = params['resetEmailSalt'];
      this.resetNonce = params['resetNonce'];
    });

    if (!this.resetEmailSalt || !this.resetNonce) {
      this.noticeService.setNotice('链接错误！', [{
        id: 'notice-link-default'
      }]);
      return;
    }
    const data = {
      resetEmailSalt: this.resetEmailSalt,
      resetNonce: this.resetNonce
    };
    this.userData.passwordResetCheck(data)
      .subscribe(response => this.handlePasswordResetCheck(response),
        err => this.responseService.handleError(err));
  }

  handlePasswordResetCheck(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.userPassword = response.data;
        break;
      case 4030:
      case 4031:
      case 4033:
        this.responseService.handleResponse(response);
        break;
      default:
        this.noticeService.setNotice(Lang.CN.SystemError, [{
          id: 'notice-link-default'
        }]);
        break;
    }
  }

  resetPassword(): void {
    if (this.userPassword.userNewPassword !== this.userNewPasswordCheck) {
      this.noticeService.setNotice('密码不相同！');
      return;
    }
    this.userData.passwordReset(this.userPassword)
      .subscribe(response => this.handlePasswordReset(response),
        err => this.responseService.handleError(err));
  }

  handlePasswordReset(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice('重置成功！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4033:
      case 4034:
      default:
        this.responseService.handleResponse(response);
        break;
    }

  }
}
