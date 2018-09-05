import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {OrderData} from '../../data/order.data';
import {PaymentData} from '../../data/payment.data';

import {RestResponse} from '../../object/rest-response';
import {Order} from '../../object/order';

import {Setting} from '../../setting/setting';

@Component({
    selector: 'order',
    styleUrls: ['./order.component.css'],
    templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
    setting = Setting;
    order: Order;

    paymentCode = '';
    paymentMethodId = 0;
    orderCode = '';

    refreshingPaymentStatus = false;
    isCardPaymentNotConfirmed = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cookieService: CookieService,
                private noticeService: NoticeService,
                private responseService: ResponseService,
                private commonService: CommonService,
                private orderData: OrderData,
                private paymentData: PaymentData) {
    }

    ngOnInit(): void {
        this.paymentCode = this.cookieService.get(Setting.COOKIE_K_PAYMENT_CODE);
        this.paymentMethodId = Number.parseInt(this.cookieService.get(Setting.COOKIE_K_PAYMENT_METHOD));

        this.route.params.forEach((params: Params) => {
            const orderCode: string = params['orderCode'];
            this.orderCode = orderCode;

            // TODO 目前有已注册用户可以浏览任意订单的不严谨之处，需要修复
            if (this.orderCode === this.cookieService.get('orderCode') || this.cookieService.get('userAccessToken')) {
                this.getOrder(this.orderCode);
            } else {
                this.router.navigate(['/']);
            }
        });

    }

    private getOrder(orderCode: string): void {
        this.orderData.getOrder(orderCode).subscribe(
            response => this.handleGetOrder(response),
            err => this.responseService.handleError(err)
        );
    }

    handleGetOrder(response: RestResponse) {
        switch (response.code) {
            case 2000:

                this.order = response.data;
                this.order.time = this.commonService.timeFormat(this.order.createAt);

                this.order.originOrderAmount = 0;
                for (let i = 0; i < this.order.orderTicketsInfo.length; i++) {
                    this.order.orderTicketsInfo[i].orderPrice
                        = this.order.orderTicketsInfo[i].typeTicketRequestedQty * this.order.orderTicketsInfo[i].typeNormalPrice;
                    this.order.orderTicketsInfo[i].orderPrice = Number(this.order.orderTicketsInfo[i].orderPrice.toFixed(2));
                    this.order.originOrderAmount += this.order.orderTicketsInfo[i].orderPrice;
                }
                this.order.originOrderAmount = Number(this.order.originOrderAmount.toFixed(2));

                this.order.giftCardAmount = 0;
                if (this.order.giftCardUsed) {
                    for (let i = 0; i < this.order.orderGiftCards.length; i++) {
                        this.order.giftCardAmount = this.order.giftCardAmount + this.order.orderGiftCards[i].giftCardUseAmount;
                    }
                    this.order.giftCardAmount = Number(this.order.giftCardAmount.toFixed(2));
                }

                if (this.order.couponUsed) {
                    this.order.couponAmount = (this.order.orderAmount + this.order.giftCardAmount) * 100
                        / (100 - this.order.couponData.couponDiscountPercentage)
                        - this.order.giftCardAmount - this.order.orderAmount;
                    this.order.couponAmount = Number(this.order.couponAmount.toFixed(2));
                } else {
                    this.order.couponAmount = 0;
                }

                this.order.deliveryFee = Number(
                    (this.order.orderAmount + this.order.couponAmount + this.order.giftCardAmount
                    - this.order.originOrderAmount).toFixed(2));

                if (!this.order.orderPs) {
                    this.order.orderPs = '无';
                }

                this.refreshingPaymentStatus = false;
                this.isCardPaymentNotConfirmed = this.paymentMethodId === Setting.ID_CREDIT_CARD
                    && (this.order.orderStatus === 2 || this.order.orderStatus === 8 || this.order.orderStatus === 10);

                break;
            case 6401:
            case 7000:
            case 7404:
            default:
                this.responseService.handleResponse(response);
                break;
        }
    }

    refresh(): void {
        window.location.reload();
    }

    onClickRefreshPayment(): void {
        this.refreshingPaymentStatus = true;
        this.paymentData.manualUpdateUnionPay(this.paymentCode).subscribe(
            response => this.handleRefreshPayment(response),
            err => this.responseService.error(err)
        );
    }

    onClickRefreshStatus(): void {
        this.getOrder(this.orderCode);
    }

    private handleRefreshPayment(response: RestResponse): void {
        if (response.code !== 2000) {
            return this.responseService.handleResponse(response);
        }

        // refresh order info
        this.getOrder(this.orderCode);
    }
}
