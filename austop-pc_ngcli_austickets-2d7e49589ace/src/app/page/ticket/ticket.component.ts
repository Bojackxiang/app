import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

import {CartData} from '../../data/cart.data';
import {TicketData} from '../../data/ticket.data';

import {RestResponse} from '../../object/rest-response';
import {Ticket} from '../../object/ticket';
import {TicketType} from '../../object/ticket-type';

@Component({
  selector: 'ticket',
  styleUrls: ['./ticket.component.css'],
  templateUrl: './ticket.component.html',
})
export class TicketComponent implements OnInit {
  ticket: Ticket;
  currentTicketType: TicketType;
  date: Date = new Date();
  ticketNumber: number;
  ticketAction: string;
  ticketArticle;
  init = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private ticketData: TicketData,
              private cartData: CartData,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cookieService: CookieService,
              private commonService: CommonService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const ticketCode: string = params['ticketCode'];
      this.ticketData.getTicket(ticketCode)
        .subscribe(response => this.handleGetTicket(response),
          err => this.responseService.handleError(err));
    });
  }

  handleGetTicket(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.init = true;
        this.ticket = response.data;

        this.ticket.time = this.commonService.timeDuringFormat(this.ticket.ticketStartTime, this.ticket.ticketEndTime);

        if (this.ticket.ticketHtmlContent) {
          if (this.ticket.ticketHtmlContent.contentHtml) {
            this.ticketArticle = this.sanitizer.bypassSecurityTrustHtml(this.ticket.ticketHtmlContent.contentHtml);
          }
        }
        break;
      case 3000:
      case 3404:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  chooseTicketType(ticketType: TicketType): void {
    this.currentTicketType = ticketType;
    this.init = false;
  }

  checkStock(): boolean {
    if (!this.currentTicketType) {
      // No selected ticketType
      this.noticeService.setNotice(Lang.CN.ChooseTicketType);
      return false;
    }

    if (this.ticketNumber < 1 || Math.floor(this.ticketNumber) !== this.ticketNumber) {
      // Illegal Input
      this.noticeService.setNotice(Lang.CN.WrongInput);
      return false;
    }

    if (this.ticketNumber > this.currentTicketType.typeStock) {
      // Out of Stock
      this.noticeService.setNotice(Lang.CN.OutOfStock);
      return false;
    }

    return true;

  }

  updateCart(ticketAction: string): void {
    this.ticketAction = ticketAction;
    if (this.checkStock()) {

      const data = {
        'itemRef': this.currentTicketType.typeId,
        'itemQuantity': this.ticketNumber,
        'itemTicketCode': this.ticket.ticketCode,
        'itemCartCode': this.cookieService.get('cartCode'),
        'itemCartUserCode': this.cookieService.get('userCode')
      };
      this.cartData.updateCartItem(data)
        .subscribe(response => this.handleUpdateCartItem(response),
          err => this.responseService.handleError(err));
    }
  }

  handleUpdateCartItem(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        if (response.data) {
          const time = new Date();
          if (this.cookieService.get('userCode')) {
            time.setTime(Number(this.cookieService.get('userAccessTokenExpireAt')));
          } else {
            time.setTime(time.getTime() + Setting.EXPIRE_LOG_OFF_CART);
          }
          this.cookieService.put('cartCode', response.data.cartCode, {expires: time});
        }
        this.ticketNumber = 0;
        switch (this.ticketAction) {
          case 'addCart':
            this.noticeService.setNotice(Lang.CN.AddCart);
            break;
          case 'checkOut':
            this.noticeService.setNotice(Lang.CN.CheckOut, [{
              id: 'notice-link-cart'
            }]);
            setTimeout(() => {
              this.noticeService.button('notice-link-cart')
                .subscribe(() => {
                  this.router.navigate([Setting.API_CART]);
                  this.noticeService.hideNotice();
                });
            }, 0);
            break;
        }
        break;
      case 7640:
        this.cookieService.remove('cartCode');
        this.updateCart(this.ticketAction);
        break;
      case 7604:
      case 7605:
      case 7608:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

}
