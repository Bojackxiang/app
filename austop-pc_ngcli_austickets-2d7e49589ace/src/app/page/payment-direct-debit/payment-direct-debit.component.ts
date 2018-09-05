import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {CookieService} from 'ngx-cookie';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'payment-direct-debit',
  templateUrl: './payment-direct-debit.component.html',
  styleUrls: ['./payment-direct-debit.component.css']
})
export class PaymentDirectDebitComponent implements OnInit {
  orderCode: string;
  orderAmount: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private noticeService: NoticeService,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.orderCode = params['orderCode'];
    });

    if (this.cookieService.get('orderAmount')) {
      this.orderAmount = Number(this.cookieService.get('orderAmount'));
    } else {
      this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}${Setting.ROUTE_PAYMENT}`]);
    }

  }

  gotoPaymentList(): void {
    this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT]);
  }

  paymentConfirm(): void {
    this.noticeService.setNotice(`<img src="/assets/images/wechat_mobile.jpeg" width="200" height="200">
      <br>将转账截图发至微信客服：<br>悉尼星魔方(WechatID: AusTopEvents)<br>可快速确认！`, [{
      class: 'u-button u-button-alert f-mgr-05rem',
      id: 'notice-payment-no',
      string: '尚未转账'
    }, {
      id: 'notice-payment-yes',
      string: '已转账'
    }]);

    setTimeout(() => {
      let yes, no;
      no = this.noticeService.button('notice-payment-no')
        .subscribe(() => {
          yes.unsubscribe();
          this.noticeService.hideNotice();
        });
      yes = this.noticeService.button('notice-payment-yes')
        .subscribe(() => {
          no.unsubscribe();

          this.noticeService.setNotice('转账确认后客服将尽快联系，请耐心等待<br>您可通过网站底部链接继续浏览本站');
          this.cookieService.remove('orderCode');
          this.cookieService.remove('orderAmount');
          this.cookieService.remove('surcharge');
          this.cookieService.remove('totalAmount');
        });
    }, 0);
  }
}
