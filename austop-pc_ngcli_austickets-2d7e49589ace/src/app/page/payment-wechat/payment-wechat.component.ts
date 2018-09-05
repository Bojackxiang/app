import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {PaymentData} from '../../data/payment.data';

import {RestResponse} from '../../object/rest-response';
import {PaymentWechat} from '../../object/payment-wechat';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'payment-wechat',
  templateUrl: './payment-wechat.component.html',
  styleUrls: ['./payment-wechat.component.css']
})
export class PaymentWechatComponent implements OnInit {
  orderCode: string;
  orderAmount: number;
  surcharge: number;
  discount: number;
  totalAmount: number;
  paymentWechat: PaymentWechat;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cookieService: CookieService,
              private paymentData: PaymentData) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.orderCode = params['orderCode'];
    });

    if (this.cookieService.get('orderAmount') && this.cookieService.get('surcharge')
      && this.cookieService.get('discount') && this.cookieService.get('totalAmount')) {
      this.orderAmount = Number(this.cookieService.get('orderAmount'));
      this.surcharge = Number(this.cookieService.get('surcharge'));
      this.discount = Number(this.cookieService.get('discount'));
      this.totalAmount = Number(this.cookieService.get('totalAmount'));

      this.paymentData.createWechat(this.orderCode)
        .subscribe(response => this.handleCreateWechat(response),
          err => this.noticeService.setNotice(Lang.CN.SystemError, [{
            id: 'notice-refresh'
          }])
        );
    } else {
      this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}${Setting.ROUTE_PAYMENT}`]);
    }

  }

  handleCreateWechat(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.paymentWechat = response.data;
        break;
      case 7000:
      case 7404:
      case 7025:
        this.responseService.handleResponse(response);
        break;
      default:
        this.noticeService.setNotice(Lang.CN.SystemError, [{
          id: 'notice-refresh'
        }]);
        break;
    }
  }

  paymentCheck(): void {
    this.noticeService.setNotice('loading');
    this.paymentData.getWechat(this.paymentWechat.paymentCode)
      .subscribe(response => this.handleGetWechat(response),
        err => this.responseService.handleError(err));
  }

  handleGetWechat(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        if (response.data.paymentSuccessful) {
          this.noticeService.setNotice('支付成功！请前往邮箱查收订单确认信！', [{
            id: 'notice-link-order'
          }]);
          setTimeout(() => {
            this.noticeService.button('notice-link-order')
              .subscribe(() => {
                this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode]);
                this.noticeService.hideNotice();
              });
          }, 0);
          this.cookieService.remove('orderAmount');
          this.cookieService.remove('surcharge');
          this.cookieService.remove('totalAmount');
        } else {
          this.noticeService.setNotice('尚未支付，若您已支付，请等待数秒后查询！');
        }
        break;
      case 7540:
      default:
        this.noticeService.setNotice('尚未支付，若您已支付，请等待数秒后查询！');
        break;
    }
  }

  gotoPaymentList(): void {
    this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT]);
  }
}
