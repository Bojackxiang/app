import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {OrderData} from '../../data/order.data';

import {RestResponse} from '../../object/rest-response';
import {Order} from '../../object/order';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

declare const paypal: any;

@Component({
  selector: 'payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.css']
})
export class PaymentPaypalComponent implements OnInit {
  loading = true;
  order: Order;
  orderCode: string;
  orderAmount: number;
  surcharge: number;
  discount: number;
  totalAmount: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cookieService: CookieService,
              private orderData: OrderData) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.orderCode = params['orderCode'];
    });

    if (this.cookieService.get('orderAmount') && this.cookieService.get('surcharge')
      && this.cookieService.get('totalAmount') && this.cookieService.get('discount')) {
      this.orderAmount = Number(this.cookieService.get('orderAmount'));
      this.surcharge = Number(this.cookieService.get('surcharge'));
      this.discount = Number(this.cookieService.get('discount'));
      this.totalAmount = Number(this.cookieService.get('totalAmount'));

      this.orderData.getOrder(this.orderCode)
        .subscribe(response => this.handleGetOrder(response),
          err => this.noticeService.setNotice('网络异常', [{
            id: 'notice-refresh'
          }]));
    } else {
      this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}${Setting.ROUTE_PAYMENT}`]);
    }
  }

  handleGetOrder(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.order = response.data;
        this.orderAmount = this.order.orderAmount;
        if (this.order.orderStatus !== 2) {
          this.noticeService.setNotice('该订单无需支付！', [{
            id: 'notice-link-default'
          }]);
        } else {
          this.loading = false;
          const createPaymentUrl = `${Setting.API_BASE}${Setting.API_PAYMENT}/paypalpayments/orders/${this.orderCode}`;
          const executePaymentUrl = `${Setting.API_BASE}${Setting.API_PAYMENT}/paypalpayments`;

          const noticeService = this.noticeService;
          const cookieService = this.cookieService;
          const orderCode = this.orderCode;
          const router = this.router;

          paypal.Button.render({
            env: 'production',
            payment: function (resolve, reject) {
              paypal.request.post(createPaymentUrl)
                .then(function (data) {
                  switch (data.code) {
                    case 2000:
                      resolve(data.data.paypalPaymentId);
                      break;

                    default:
                      noticeService.setNotice(Lang.CN.SystemError, [{
                        id: 'notice-refresh'
                      }]);
                      break;
                  }
                })
                .catch(function (err) {
                  noticeService.setNotice(Lang.CN.SystemError, [{
                    id: 'notice-refresh'
                  }]);
                });
            },
            onAuthorize: function (data) {
              const nData = {
                paypalPaymentId: data.paymentID,
                payerId: data.payerID
              };
              paypal.request.post(executePaymentUrl, nData)
                .then(function (data) {
                  switch (data.code) {
                    case 2000:
                      noticeService.setNotice('支付成功！请前往邮箱查收订单确认信！', [{
                        id: 'notice-link-success'
                      }]);
                      setTimeout(() => {
                        noticeService.button('notice-link-success')
                          .subscribe(() => {
                            router.navigate([`${Setting.ROUTE_ORDER}/${orderCode}`]);
                            noticeService.hideNotice();
                          });
                      });
                      cookieService.remove('surcharge');
                      cookieService.remove('totalAmount');
                      break;
                    default:
                      noticeService.setNotice(Lang.CN.SystemError, [{
                        id: 'notice-refresh'
                      }]);
                      break;
                  }
                })
                .catch(function (err) {
                  noticeService.setNotice(Lang.CN.SystemError, [{
                    id: 'notice-refresh'
                  }]);
                });
            },
            onCancel: function (data) {
              router.navigate([Setting.ROUTE_ORDER + '/' + orderCode + Setting.ROUTE_PAYMENT]);
            }
          }, '#paypal-button');
        }
        break;
      case 7000:
      case 7404:
      case 7025:
        this.responseService.handleResponse(response);
        break;
      default:
        this.noticeService.setNotice('异常情况，请刷新页面！', [{
          id: 'notice-refresh'
        }]);
        break;
    }
  }


  gotoPaymentList(): void {
    this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT]);
  }
}
