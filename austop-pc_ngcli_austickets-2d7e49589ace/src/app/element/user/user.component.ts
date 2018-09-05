import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {UserData} from '../../data/user.data';

import {RestResponse} from '../../object/rest-response';
import {User} from '../../object/user';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'user',
  styleUrls: ['./user.component.css'],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  boxShow = false;
  setting = Setting;
  isLogin: boolean;
  userBoxType: number; // 0.login,1.register,2.forgetPassword
  userEmail: string;
  userPassword: string;
  userPasswordCheck: string;
  userCode: string;
  user: User;
  privacyPolicy: boolean;

  constructor(private router: Router,
              private noticeService: NoticeService,
              private cookieService: CookieService,
              private responseService: ResponseService,
              public commonService: CommonService,
              private userData: UserData) {
  }

  ngOnInit(): void {
    this.resetWindowPosition();

    Observable
      .fromEvent(window, 'resize')
      .throttleTime(100)
      .subscribe(e => {
        this.resetWindowPosition();
      });


    if (this.cookieService.get('userAccessTokenExpireAt')) {
      this.userEmail = this.cookieService.get('userEmail');
    }
  }

  loginBox(): void {
    this.userBoxType = 0;
    this.showBox();
  }

  registerBox(): void {
    this.userBoxType = 1;
    this.showBox();
  }

  showBox(): void {
    setTimeout(() => {
      this.resetWindowPosition();
    }, 0);
    this.boxShow = true;
  }

  hideBox(): void {
    this.boxShow = false;
  }

  switchBox(): void {
    this.userBoxType = 0;
  }

  listenNoticeAlert(): void {
    setTimeout(() => {
      this.noticeService.button('notice-alert')
        .subscribe(() => {
          this.boxShow = true;
        });
    }, 0);
  }

  login(): void {
    this.noticeService.setNotice();
    this.boxShow = false;

    if (!this.userPassword || !this.userEmail) {
      this.noticeService.setNotice('请填写Email与密码！');
      this.listenNoticeAlert();
      return;
    }

    const data = {
      'userEmail': this.userEmail,
      'userPassword': this.userPassword
    };
    this.userData.login(data)
      .subscribe(response => this.handleLogin(response),
        err => this.responseService.handleError(err));

  }

  register(): void {
    this.noticeService.setNotice();
    this.boxShow = false;

    if (!this.userPassword || !this.userEmail) {
      this.noticeService.setNotice('请填写Email与密码！');
      this.listenNoticeAlert();
      return;
    }
    if (this.userPassword !== this.userPasswordCheck) {
      this.noticeService.setNotice('密码不相同！');
      this.listenNoticeAlert();
      return;
    }
    if (!this.privacyPolicy) {
      this.noticeService.setNotice('请阅读并同意隐私政策！');
      this.listenNoticeAlert();
      return;
    }

    const data = {
      'userEmail': this.userEmail,
      'userPassword': this.userPassword,
      'emailSubscription': true
    };

    this.userData.register(data)
      .subscribe(response => this.handleRegister(response),
        err => this.responseService.handleError(err));
  }

  logoff(): void {
    this.boxShow = false;
    this.noticeService.setNotice();

    this.userData.logoff(this.cookieService.get('userCode'))
      .subscribe(response => this.handleLogoff(response),
        err => this.responseService.handleError(err));
  }

  forgotPassword(): void {
    this.userBoxType = 2;
  }

  resetPassword(): void {
    this.boxShow = false;
    this.noticeService.setNotice();

    if (!this.userEmail) {
      this.noticeService.setNotice('请填写邮箱！');
      this.listenNoticeAlert();
      return;
    }

    const data = {
      resetEmail: this.userEmail
    };

    this.userData.passwordResetRequest(data)
      .subscribe(response => this.handlePasswordResetRequest(response),
        err => {
          this.noticeService.setNotice(Lang.CN.SystemError);
          this.listenNoticeAlert();
        });
  }

  handleLogin(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.user = response.data;
        const loginTime = new Date(this.user.userAccessTokenExpireAt);

        this.cookieService.put('userAccessToken', this.user.userAccessToken, {expires: loginTime});
        this.cookieService.put('userCode', this.user.userCode, {expires: loginTime});
        this.cookieService.put('userEmail', this.user.userEmail, {expires: loginTime});
        this.cookieService.put('userAccessTokenExpireAt', this.user.userAccessTokenExpireAt.toString(), {expires: loginTime});

        if (this.user.cartCode) {
          this.cookieService.put('cartCode', this.user.cartCode, {expires: loginTime});
        } else {
          this.cookieService.remove('cartCode');
        }

        this.noticeService.setNotice('登陆成功！');
        break;
      case 4028:
        this.noticeService.setNotice('您的账号暂未认证Email，请前往邮箱查看认证邮件！', [{
          class: 'u-button u-button-red u-button-alert f-mgr-05rem',
          id: 'notice-resend-email',
          string: '重发验证邮件'
        }, {
          class: 'u-button u-button-alert',
          id: 'notice-wait-email'
        }]);

        setTimeout(() => {
          let send, wait;
          send = this.noticeService.button('notice-resend-email')
            .subscribe(() => {
              this.userData.emailConfirmationRequest(response.data.userCode)
                .subscribe(response => {
                    this.handleEmailConfirmationRequest(response);
                  },
                  err => {
                    this.noticeService.setNotice(Lang.CN.SystemError);
                    this.listenNoticeAlert();
                  });
              wait.unsubscribe();
            });

          wait = this.noticeService.button('notice-wait-email')
            .subscribe(() => {
              this.boxShow = true;
              send.unsubscribe();
            });
        }, 0);

        break;
      case 4000:
      case 4003:
      case 4009:
      case 4404:
      default:
        this.responseService.handleResponse(response);
        this.listenNoticeAlert();
        break;
    }
  }

  handleLogoff(response: RestResponse): void {
    switch (response.code) {
      case 2000:
      case 6401:
      case 6463:
        this.cookieService.remove('cartCode');
        this.cookieService.remove('userAccessToken');
        this.cookieService.remove('userCode');
        this.cookieService.remove('userEmail');
        this.cookieService.remove('userAccessTokenExpireAt');

        this.noticeService.setNotice('注销成功！');
        break;

      default:
        this.responseService.handleResponse(response);
        this.listenNoticeAlert();
        break;
    }
  }

  handleRegister(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.userBoxType = 0;
        this.noticeService.setNotice('注册成功！请前往邮箱认证！');
        this.listenNoticeAlert();
        break;
      case 4003:
      case 4004:
      case 4005:
      default:
        this.responseService.handleResponse(response);
        this.listenNoticeAlert();
        break;
    }
  }


  resetWindowPosition(): void {
    const dom = <HTMLElement>document.querySelector('#m-user-box');
    const width: number = dom.offsetWidth;
    const height: number = dom.offsetHeight;
    const windowHeight: number = window.document.documentElement.clientHeight;
    const windowWidth: number = window.document.documentElement.clientWidth;
    const newTop: number = (windowHeight - height) / 2;
    const newLeft: number = (windowWidth - width) / 2;

    dom.style.left = newLeft + 'px';
    dom.style.top = newTop + 'px';
  }

  handlePasswordResetRequest(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice('请前往邮箱查收密码重置邮件！');
        this.userBoxType = 0;
        this.listenNoticeAlert();
        break;
      case 4007:
      case 4404:
      default:
        this.responseService.handleResponse(response);
        this.listenNoticeAlert();
        break;
    }
  }

  handleEmailConfirmationRequest(response: RestResponse): void {
    switch (response.code) {
      case 2400:
        this.noticeService.setNotice('请前往邮箱查收密码重置邮件！');
        this.userBoxType = 0;
        this.listenNoticeAlert();
        break;
      default:
        this.responseService.handleResponse(response);
        this.listenNoticeAlert();
        break;
    }
  }
}
