import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {CookieService} from 'ngx-cookie';
import {ResponseService} from '../../service/response.service';

import {PaymentData} from '../../data/payment.data';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';
import {RestResponse} from "../../object/rest-response";
import {PaymentAlipay} from '../../object/payment-alipay';

@Component({
  selector: 'payment-alipay-qrcode',
  templateUrl: './payment-alipay-qrcode.component.html',
  styleUrls: ['./payment-alipay-qrcode.component.css']
})
export class PaymentAlipayQrcodeComponent implements OnInit {
  orderCode: string;
  orderAmount: number;
  surcharge: number;
  discount: number;
  totalAmount: number;
  paymentAlipay: PaymentAlipay;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private noticeService: NoticeService,
              private cookieService: CookieService,
              private responseService: ResponseService,
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

      this.paymentData.createAlipay(this.orderCode)
        .subscribe(
          response => this.handleCreateAlipay(response),
          err => this.noticeService.setNotice(Lang.CN.SystemError, [{id: 'notice-refresh'}])
        );
    } else {
      this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}${Setting.ROUTE_PAYMENT}`]);
    }
  }

  gotoPaymentList(): void {
    this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT]);
  }

  paymentConfirm(): void {
    this.paymentData.getAlipay(this.paymentAlipay.paymentCode)
      .subscribe(
        response => this.handleGetAlipay(response),
        err => this.responseService.handleError(err)
      );
  }

  private handleCreateAlipay(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.paymentAlipay = response.data;
        break;
      default:
        console.error(`${response.code} | ${response.msg}`);
        this.responseService.handleResponse(response);
        break;
    }
  }

  private handleGetAlipay(response: RestResponse): void {
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
          this.noticeService.setNotice('正确认您的支付，若您已支付，请等待数秒后查询！');
        }
        break;
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }
}
