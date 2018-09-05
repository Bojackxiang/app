import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {CartData} from '../../data/cart.data';
import {OrderData} from '../../data/order.data';
import {PaymentData} from '../../data/payment.data';

import {RestResponse} from '../../object/rest-response';
import {Order} from '../../object/order';
import {Payment} from '../../object/payment';

import {Setting} from '../../setting/setting';

@Component({
    selector: 'payment',
    styleUrls: ['./payment.component.css'],
    templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
    order: Order;
    payments: Payment[];
    selectedPayment: Payment;
    orderCode: string;
    orderAmount: number;
    surcharge: number;
    discount: number;
    totalAmount: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private paymentData: PaymentData,
                private orderData: OrderData,
                private noticeService: NoticeService,
                private responseService: ResponseService,
                private cookieService: CookieService,
                private cartData: CartData) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.orderCode = params['orderCode'];
        });
        this.orderData.getOrder(this.orderCode)
            .subscribe(response => this.handleGetOrder(response),
                err => this.responseService.handleError(err));
        this.paymentData.getPayments()
            .subscribe(response => this.handleGetPayments(response),
                err => this.responseService.handleError(err));
    }

    handleGetOrder(response: RestResponse): void {
        switch (response.code) {
            case 2000:
                this.order = response.data;
                if (this.order.orderStatus !== 2) {
                    if (this.order.orderStatus === 6) {
                        this.noticeService.setNotice('该订单已被关闭，请重新下单！', [{
                            id: 'notice-link-default'
                        }]);
                    } else {
                        this.noticeService.setNotice('该订单无需支付！', [{
                            id: 'notice-link-default'
                        }]);
                    }
                }
                this.totalAmount = this.order.orderAmount;
                break;
            case 7000:
            case 7025:
            case 7404:
                this.responseService.handleResponse(response);
                break;
            default:
                this.noticeService.setNotice('异常情况，请刷新页面！', [{
                    id: 'notice-refresh'
                }]);
                break;
        }
    }

    handleGetPayments(response: RestResponse): void {
        switch (response.code) {
            case 2000:
                this.payments = response.data;
                break;

            default:
                this.noticeService.setNotice('异常情况，请刷新页面！', [{
                    id: 'notice-refresh'
                }]);
                break;
        }
    }

    selectPayment(payment: Payment): void {
        if (payment.methodName === '信用卡支付') {
            // add credit card notice
            this.noticeService.setNotice(Setting.INFO_CREDIT_CARD_METHOD);
            this.cookieService.put(Setting.COOKIE_K_PAYMENT_METHOD, String(Setting.ID_CREDIT_CARD));
        }

        this.selectedPayment = payment;

        // FIXME once the migration of wechat payment is finalised at mobile APP side
        // remove this together with mobile webapp and API
        if ('微信支付' === this.selectedPayment.methodName) {
            // hard-set surcharge to 1%
            this.selectedPayment.methodSurchargePercentage = 1;
            this.selectedPayment.methodSurchargeAmount = 0;
        }

        // surcharge on order amount
        this.surcharge = this.order.orderAmount * this.selectedPayment.methodSurchargePercentage / 100
            + this.selectedPayment.methodSurchargeAmount;
        this.surcharge = Number(this.surcharge.toFixed(2));
        this.totalAmount = this.order.orderAmount + this.surcharge;
        this.totalAmount = Number(this.totalAmount.toFixed(2));

        // discount on total amount
        this.discount = this.totalAmount * this.selectedPayment.methodDiscountPercentage / 100
            + this.selectedPayment.methodDiscountAmount;
        this.discount = Number(this.discount.toFixed(2));
        this.totalAmount = this.totalAmount - this.discount;
        this.totalAmount = Number(this.totalAmount.toFixed(2));
    }

    orderPay(): void {
        this.orderData.payOrder(this.orderCode, this.selectedPayment.methodCode)
            .subscribe(response => this.handlePayOrder(response),
                err => this.responseService.handleError(err));
    }

    handlePayOrder(response: RestResponse): void {
        switch (response.code) {
            case 2000:
                this.cartData.deleteCart(this.cookieService.get('cartCode'))
                    .subscribe(response => {
                        },
                        err => {
                        });
                this.cookieService.put('orderAmount', this.order.orderAmount.toString());
                this.cookieService.put('surcharge', this.surcharge.toString());
                this.cookieService.put('totalAmount', this.totalAmount.toString());
                this.cookieService.put('discount', this.discount.toString());
                switch (response.data.methodId) {
                    case 2016:
                        this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT + '/directDebit']);
                        break;
                    case 2017:
                        this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT + '/paypal']);
                        break;
                    case 2018:
                        this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT + '/alipayQrcode']);
                        break;
                    case 2019:
                        this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT + '/unionpay']);
                        break;
                    case 2021:
                        this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT + '/wechat']);
                        break;
                    case 2022:
                        this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}${Setting.ROUTE_PAYMENT}/card`]);
                        break;
                    default:
                        this.noticeService.setNotice('异常情况，请刷新页面！', [{
                            id: 'notice-refresh'
                        }]);
                        break;
                }
                break;

            default:
                this.noticeService.setNotice('异常情况，请刷新页面！', [{
                    id: 'notice-refresh'
                }]);
                break;
        }
    }
}
