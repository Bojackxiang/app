import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {UserData} from '../../data/user.data';

import {RestResponse} from '../../object/rest-response';
import {UserInformation} from '../../object/user-information';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'user-information',
  styleUrls: ['./user-information.component.css'],
  templateUrl: './user-information.component.html',
})
export class UserInformationComponent implements OnInit {
  user: UserInformation;
  userOriginalPassword: string;
  userNewPassword: string;
  userNewPasswordCheck: string;

  constructor(private router: Router,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cookieService: CookieService,
              private userData: UserData) {
  }

  ngOnInit(): void {
    if (this.cookieService.get('userAccessToken')) {
      this.userData.getUser(this.cookieService.get('userCode'))
        .subscribe(response => this.handleGetUser(response),
          err => this.responseService.handleError(err));
    } else {
      this.router.navigate(['/']);
    }
  }

  handleGetUser(response: RestResponse) {
    switch (response.code) {
      case 2000:
        this.user = response.data;
        break;
      case 6401:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  updateUser(): void {
    this.noticeService.setNotice();
    this.userData.updateUser(this.cookieService.get('userCode'), this.user)
      .subscribe(response => this.handleUpdateUser(response),
        err => this.responseService.handleError(err));
  }

  handleUpdateUser(response: RestResponse) {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice(Lang.CN.UpdateSucceed);
        break;
      case 4020:
      case 6401:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  updateUserPassword(): void {
    if (!this.userOriginalPassword || !this.userNewPassword) {
      this.noticeService.setNotice('请填写密码！');
      return;
    }
    if (this.userOriginalPassword === this.userNewPassword) {
      this.noticeService.setNotice('新旧密码不能相同！');
      return;
    }
    if (this.userNewPassword !== this.userNewPasswordCheck) {
      this.noticeService.setNotice('密码不相同！');
      return;
    }
    this.noticeService.setNotice();
    const data = {
      'userOriginalPassword': this.userOriginalPassword,
      'userNewPassword': this.userNewPassword
    };
    this.userData.updateUserPassword(this.cookieService.get('userCode'), data)
      .subscribe(response => this.handleUpdateUserPassword(response),
        err => this.responseService.handleError(err));

  }

  handleUpdateUserPassword(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice(Lang.CN.UpdateSucceed);
        break;
      case 4010:
      case 4011:
      case 6401:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }
}
