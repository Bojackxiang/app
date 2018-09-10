import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';

import {UserData} from '../../data/user.data';

import {RestResponse} from '../../object/rest-response';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'user-unsubscription',
  templateUrl: './user-unsubscription.component.html',
})
export class UserUnsubscriptionComponent implements OnInit {
  userCode: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private userData: UserData) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.userCode = params['userCode'];
    });

    this.userData.unsubscription(this.userCode)
      .subscribe(response => this.handleUnsubscription(response),
        err => this.responseService.handleError(err));
  }

  handleUnsubscription(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice('取消订阅成功！您随时可通过个人信息页面重新订阅！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4000:
        this.noticeService.setNotice('链接错误！', [{
          id: 'notice-link-default'
        }]);
        break;
      default:
        this.noticeService.setNotice(Lang.CN.SystemError, [{
          id: 'notice-link-default'
        }]);
        break;
    }
  }
}
