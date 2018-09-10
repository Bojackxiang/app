/**
 * Created by hansmong on 20/07/2017.
 */

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import 'rxjs/add/operator/toPromise';

import {NoticeService} from '../../service/notice.service';
import {CookieService} from 'ngx-cookie';

import {PaymentData} from '../../data/payment.data';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

import {RestResponse} from '../../object/rest-response';

declare const Stripe: any;

@Component({
    selector: 'app-payment-stripe',
    templateUrl: './payment-stripe.component.html',
    styleUrls: ['./payment-stripe.component.css']
})

export class PaymentStripeComponent implements OnInit {
    cardHolderName: string;
    displaySpinner = false;

    errorMsgCardNumber = '';
    errorMsgCardExpiry = '';
    errorMsgCardCvc = '';

    private orderCode: string;
    orderAmount: number;
    private surcharge: number;
    private totalAmount: number;
    private discount: number;

    private lang: string;
    private pageLang: any;
    private stripe: any;

    private cardNumber: any;
    private cardExpiry: any;
    private cardCvc: any;

    displayThreeDSecure = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private noticeService: NoticeService,
                private cookieService: CookieService,
                private paymentData: PaymentData) {
    }

    ngOnInit() {
        this.lang = this.cookieService.get('lang');
        if (!this.lang) {
            this.lang = 'CN';
        }
        if (this.lang) {
            this.pageLang = Lang[this.lang.toUpperCase()];
        }

        this.route.params.forEach((params: Params) => {
            this.orderCode = params['orderCode'];
        });

        if (this.cookieService.get('orderAmount') && this.cookieService.get('surcharge')
            && this.cookieService.get('totalAmount') && this.cookieService.get('discount')) {
            this.orderAmount = Number(this.cookieService.get('orderAmount'));
            this.surcharge = Number(this.cookieService.get('surcharge'));
            this.totalAmount = Number(this.cookieService.get('totalAmount'));
            this.discount = Number(this.cookieService.get('discount'));
            // initiate stripe
            this.paymentData.getStripePublicClientKey().subscribe(
                response => this.handleGetStripePublicClientKey(response),
                err => this.noticeService.setNotice(this.pageLang.NetworkError, [{
                    'id': 'notice-refresh'
                }])
            );
        } else {
            this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}${Setting.ROUTE_PAYMENT}`]);
        }
    }

    doCardPayment(): void {
        if (!this.cardHolderName) {
            this.noticeService.setNotice(this.pageLang.PaymentCardHolderError);
            return;
        }

        this.displaySpinner = true;
        let stripeSource = '';
        let redirectUrl = '';
        this.stripe.createSource(this.cardNumber, {owner: {name: this.cardHolderName}})
            .then(result => {
                const isThreeDS = result.source.card.three_d_secure.toLowerCase() !== 'not_supported';
                stripeSource = result.source.id;
                if (isThreeDS) {
                    return this.stripe.createSource({
                        type: 'three_d_secure',
                        amount: this.totalAmount * 100,
                        currency: 'aud',
                        three_d_secure: {
                            card: result.source.id
                        },
                        redirect: {
                            return_url: `https://${Setting.HOST}/orders/${this.orderCode}`
                        }
                    });
                }
                const noThreeDSError = new Error('card_3d_secure_not_supported');
                throw noThreeDSError;
            })
            .then(result => {
                redirectUrl = result.source.redirect.url;

                // pre-create a payment
                return this.paymentData.createStripePayment(this.orderCode, stripeSource).toPromise();
            })
            .then(response => {
                if (response && response.code === 2000) {
                    window.location.href = redirectUrl;
                } else {
                    throw response;
                }
            })
            .catch(err => {
                console.error('Payment error', err);
                if (err.message === 'card_3d_secure_not_supported') {
                    this.noticeService.setNotice('很抱歉，您的卡不支持3DS支付验证。');
                } else {
                    this.noticeService.setNotice('支付失败，请稍后再试。');
                }
                this.displaySpinner = false;
            });
    }

    handleDoCardPayment(response: RestResponse): void {
        this.displaySpinner = false;
        switch (response.code) {
            case 2000:
                this.noticeService.setNotice(this.pageLang.PaymentSuccess, [{
                    id: 'notice-link-order'
                }]);
                setTimeout(() => {
                    this.noticeService.button('notice-link-order')
                        .subscribe(() => {
                            this.router.navigate([`${Setting.ROUTE_ORDER}/${this.orderCode}`]);
                            this.noticeService.hideNotice();
                        });
                }, 0);
                this.cookieService.remove('orderAmount');
                this.cookieService.remove('surcharge');
                this.cookieService.remove('totalAmount');
                break;
            default:
                this.noticeService.setNotice(this.pageLang.PaymentCardFail);
                break;
        }
    }

    handleGetStripePublicClientKey(response: RestResponse): void {
        switch (response.code) {
            case 2000:
                this.stripe = Stripe(response.data.clientKey);
                const elements = this.stripe.elements({
                    locale: this.lang === 'CN' ? 'zh' : this.lang
                });

                const style = {
                    base: {
                        iconColor: '#666EE8',
                        color: '#31325F',
                        lineHeight: '22px',
                        fontSize: '0.83rem',
                        '::placeholder': {
                            color: '#aaa',
                        }
                    }
                };

                // card number
                const cardNumberStr = 'cardNumber';
                this.cardNumber = elements.create(cardNumberStr, {
                    style,
                    placeholder: this.pageLang.PaymentStripeCardNumberPlaceholder
                });
                this.cardNumber.mount(`#${cardNumberStr}`);
                this.cardNumber.on('change', (e) => {
                    if (e.error) {
                        this.errorMsgCardNumber = e.error.message;
                    } else {
                        this.errorMsgCardNumber = '';
                    }
                });

                // card expiry
                const cardExpiryStr = 'cardExpiry';
                this.cardExpiry = elements.create(cardExpiryStr, {style});
                this.cardExpiry.mount(`#${cardExpiryStr}`);
                this.cardExpiry.on('change', (e) => {
                    if (e.error) {
                        this.errorMsgCardExpiry = e.error.message;
                    } else {
                        this.errorMsgCardExpiry = '';
                    }
                });

                // card cvc
                const cardCvcStr = 'cardCvc';
                this.cardCvc = elements.create(cardCvcStr, {
                    style,
                    placeholder: this.pageLang.PaymentStripeCardCvcPlaceholder
                });
                this.cardCvc.mount(`#${cardCvcStr}`);
                this.cardCvc.on('change', (e) => {
                    if (e.error) {
                        this.errorMsgCardCvc = e.error.message;
                    } else {
                        this.errorMsgCardCvc = '';
                    }
                });

                break;
            default:
                this.noticeService.setNotice(this.pageLang.UnknownError, [{
                    id: 'notice-refresh'
                }]);
                break;
        }
    }

    stripeSetOutcome(result: any): void {
        if (result.error) {
            this.noticeService.setNotice(result.error.message);
        }
    }

    gotoPaymentList(): void {
        this.router.navigate([Setting.ROUTE_ORDER + '/' + this.orderCode + Setting.ROUTE_PAYMENT]);
    }

    toggleThreeDSecureInfo(): void {
        this.displayThreeDSecure = !this.displayThreeDSecure;
    }
}
