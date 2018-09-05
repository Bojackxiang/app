import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {Setting} from '../../setting/setting';
import {Lang} from '../../setting/lang';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';
import {PaymentData} from '../../data/payment.data';

import {PaymentUnionpayPurchase} from '../../object/payment-unionpay-purchase';

@Component({
  selector: 'payment-unionpay',
  templateUrl: './payment-unionpay.component.html',
  styleUrls: ['./payment-unionpay.component.css']
})

export class PaymentUnionpayComponent implements OnInit {
  orderCode: string;
  orderAmount: number;
  surcharge: number;
  discount: number;
  totalAmount: number;
  unionpayPurchase: PaymentUnionpayPurchase;
  unionpayObjectKeys = [];

  constructor(private router: Router, private route: ActivatedRoute,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cookieService: CookieService,
              private paymentData: PaymentData) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => this.orderCode = params['orderCode']);

    this.orderAmount = Number(this.cookieService.get('orderAmount'));
    this.surcharge = Number(this.cookieService.get('surcharge'));
    this.totalAmount = Number(this.cookieService.get('totalAmount'));
    this.discount = Number(this.cookieService.get('discount'));

    if (Number.isNaN(this.orderAmount) || Number.isNaN(this.surcharge) || Number.isNaN(this.totalAmount) || Number.isNaN(this.discount)) {
      this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}${Setting.ROUTE_PAYMENT}`]);
      return;
    }

    // create unionpay payment
    this.paymentData.createUnionPay(this.orderCode)
      .subscribe(
        response => this.handleCreateUnionPay(response),
        err => this.noticeService.setNotice(Lang.CN.SystemError, [{id: 'notice-refresh'}])
      );
  }

  private handleCreateUnionPay(response): void {
    if (response.code === 2000) {
      this.unionpayPurchase = response.data;
      // exclude unused fields in payload to build hidden form submission to unionpay
      this.unionpayObjectKeys = Object.keys(this.unionpayPurchase).filter(k => k !== 'actionUrl' && k !== 'systemReferenceId');
      this.cookieService.put(Setting.COOKIE_K_PAYMENT_CODE, this.unionpayPurchase.systemReferenceId);
      this.cookieService.put(Setting.COOKIE_K_PAYMENT_METHOD, '2019');
    } else {
      console.error(`${response.code} | ${response.msg}`);
      this.responseService.handleResponse(response);
    }
  }

  gotoPaymentList(): void {
    this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT]);
  }
}
