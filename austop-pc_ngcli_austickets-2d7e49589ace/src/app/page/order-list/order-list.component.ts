import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {UserData} from '../../data/user.data';

import {RestResponse} from '../../object/rest-response';
import {Order} from '../../object/order';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'order-list',
  styleUrls: ['./order-list.component.css'],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  setting = Setting;
  waitOrder = false;
  orders: Order[];
  hasOrders = false;

  constructor(private router: Router,
              private cookieService: CookieService,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private commonService: CommonService,
              private userData: UserData) {
  }

  ngOnInit(): void {
    if (this.cookieService.get('userAccessToken')) {
      this.userData.getOrders(this.cookieService.get('userCode'))
        .subscribe(response => this.handleGetOrders(response),
          err => this.responseService.handleError(err));
    } else {
      this.router.navigate(['/']);
    }

  }

  handleGetOrders(response: RestResponse) {
    this.waitOrder = true;
    switch (response.code) {
      case 2000:
        this.orders = response.data;
        for (let i = 0; i < this.orders.length; i++) {
          this.orders[i].time = this.commonService.timeFormat(this.orders[i].createAt);
        }
        if (this.orders.length) {
          this.hasOrders = true;
        }
        break;
      case 6401:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }
}
