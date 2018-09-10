import {Component, Injector, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {Observable} from 'rxjs/Observable';

import {NoticeService} from '../../service/notice.service';
import {CookieService} from 'ngx-cookie';

import {OrderData} from '../../data/order.data';

import {RestResponse} from '../../object/rest-response';
import {Order} from '../../object/order';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
    selector: 'notice',
    styleUrls: ['./notice.component.css'],
    templateUrl: './notice.component.html',
})

export class NoticeComponent implements OnInit {
    bodyShow = false;
    coverShow = false;
    noticeBody: string;
    noticeControl: any[];
    noticeBodySafe: SafeHtml;
    order: Order;

    constructor(private sanitizer: DomSanitizer,
                private noticeService: NoticeService,
                private cookieService: CookieService,
                private router: Router,
                private orderData: OrderData) {
    }

    ngOnInit(): void {
        this.noticeService.init(this);
        this.resetWindowPosition();
        Observable
            .fromEvent(window, 'resize')
            .throttleTime(100)
            .subscribe(e => {
                this.resetWindowPosition();
            });

        if (this.cookieService.get('orderCode')
            && Number(this.cookieService.get(Setting.COOKIE_K_PAYMENT_METHOD)) !== Setting.ID_CREDIT_CARD) {
            this.orderData.getOrder(this.cookieService.get('orderCode'))
                .subscribe(response => this.handleGetOrder(response),
                    err => {
                    });
        }
    }

    resetWindowPosition(): void {
        const dom = <HTMLElement>document.querySelector('#notice-box');
        const width: number = dom.offsetWidth;
        const height: number = dom.offsetHeight;
        const windowHeight: number = window.document.documentElement.clientHeight;
        const windowWidth: number = window.document.documentElement.clientWidth;
        const newTop: number = (windowHeight - height) / 2;
        const newLeft: number = (windowWidth - width) / 2;

        dom.style.left = newLeft + 'px';
        dom.style.top = newTop + 'px';
    }

    setNotice(body?: string, control?: any[]): void {

        if (!body) {
            // no body means loading notice;
            this.noticeBody = `<img src='/assets/images/loading.gif' width='50' height='50'>`;
            this.noticeControl = [];
        } else {
            this.noticeBody = body;

            if (!control) {
                // no control means one confirm button;
                this.noticeControl = [{
                    class: 'u-button u-button-alert',
                    id: 'notice-alert',
                    string: Lang.CN.Confirm
                }];
            } else {
                // 等待优化默认class，默认string
                for (let i = 0; i < control.length; i++) {
                    if (!control[i].class) {
                        control[i].class = 'u-button u-button-alert';
                    }
                    if (!control[i].string) {
                        control[i].string = Lang.CN.Confirm;
                    }
                }
                this.noticeControl = control;
            }
        }
        this.noticeBodySafe = this.sanitizer.bypassSecurityTrustHtml(this.noticeBody);

        this.showNotice();
    }

    showNotice(): void {
        setTimeout(() => {
            this.resetWindowPosition();
        }, 0);
        this.bodyShow = true;
        for (let i = 0; i < this.noticeControl.length; i++) {
            switch (this.noticeControl[i].id) {
                case 'notice-alert':
                    setTimeout(e => {
                        const alertButton = <HTMLElement> document.querySelector(`#notice-alert`);
                        Observable
                            .fromEvent(alertButton, 'click')
                            .take(1)
                            .subscribe(e => {
                                this.hideNotice();
                            });
                    }, 0);
                    continue;
                case 'notice-refresh':
                    setTimeout(e => {
                        const alertButton = <HTMLElement> document.querySelector(`#notice-refresh`);
                        Observable
                            .fromEvent(alertButton, 'click')
                            .take(1)
                            .subscribe(e => {
                                window.location.reload();
                            });
                    }, 0);
                    continue;
                case 'notice-link-default':
                    setTimeout(e => {
                        const alertButton = <HTMLElement> document.querySelector(`#notice-link-default`);
                        Observable
                            .fromEvent(alertButton, 'click')
                            .take(1)
                            .subscribe(e => {
                                this.router.navigate(['/']);
                                this.hideNotice();
                            });
                    }, 0);
                    continue;
                case 'notice-popup':
                    // hot blooded
                    setTimeout(e => {
                        const alertButton = <HTMLElement> document.querySelector('#notice-popup');
                        Observable
                            .fromEvent(alertButton, 'click')
                            .take(1)
                            .subscribe(() => {
                                if (this.noticeControl[i].target) {
                                    window.open(this.noticeControl[i].target);
                                }
                                this.hideNotice();
                            });
                    }, 0);
                    continue;
                default:
                    break;
            }
        }
        this.showCover();
    }

    showCover(): void {
        this.coverShow = true;
    }

    hideNotice(): void {
        this.bodyShow = false;
        this.hideCover();
    }

    hideCover(): void {
        this.coverShow = false;
    }

    // another features
    handleGetOrder(response: RestResponse): void {
        switch (response.code) {
            case 2000:
                this.order = response.data;

                if (this.order.orderStatus === 2 || this.order.orderStatus === 8 || this.order.orderStatus === 10) {
                    this.setNotice('检测到您有订单未处理，是否继续流程？', [{
                        class: 'u-button u-button-alert f-mgr-05rem',
                        id: 'notice-order-no',
                        string: '不处理'
                    }, {
                        class: 'u-button u-button-red u-button-alert',
                        id: 'notice-order-yes',
                        string: '继续流程'
                    }]);

                    setTimeout(() => {
                        let yes, no;
                        no = this.noticeService.button('notice-order-no')
                            .subscribe(() => {
                                yes.unsubscribe();
                                this.setNotice('不再提示该订单？', [{
                                    class: 'u-button u-button-alert f-mgr-05rem',
                                    id: 'notice-remind-no',
                                    string: '下次提醒'
                                }, {
                                    id: 'notice-remind-yes',
                                    string: '不再提示'
                                }]);

                                setTimeout(() => {
                                    let store, remove;
                                    store = this.noticeService.button('notice-remind-no')
                                        .subscribe(() => {
                                            this.hideNotice();
                                            remove.unsubscribe();
                                        });

                                    remove = this.noticeService.button('notice-remind-yes')
                                        .subscribe(() => {
                                            this.hideNotice();
                                            store.unsubscribe();
                                            this.cookieService.remove('orderCode');
                                            this.cookieService.remove('orderAmount');
                                            this.cookieService.remove('surchage');
                                            this.cookieService.remove('totalAmount');
                                        });
                                }, 0);
                            });
                        yes = this.noticeService.button('notice-order-yes')
                            .subscribe(() => {
                                no.unsubscribe();
                                this.router.navigate([`${Setting.ROUTE_ORDER}/${this.cookieService.get('orderCode')}`]);
                                this.hideNotice();
                            });

                    }, 0);
                } else {
                    this.cookieService.remove('orderCode');
                }

                break;
            case 7404:
                this.cookieService.remove('orderCode');
                break;
            default:
                break;
        }
    }
}
