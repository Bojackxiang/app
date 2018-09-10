import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {TicketData} from '../../data/ticket.data';

import {RestResponse} from '../../object/rest-response';
import {Ticket} from '../../object/ticket';
import {TicketType} from '../../object/ticket-type';
import {PageMeta} from '../../object/page-meta';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'ticket-list',
  styleUrls: ['./ticket-list.component.css'],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit {
  setting = Setting;
  waitTickets = false;
  tickets: Ticket[];
  pageMeta: PageMeta;
  hasTickets: boolean;
  page: number;
  time: string;
  timeStart: string;
  timeEnd: string;
  price: string;
  priceType: string;
  rangeFrom: number;
  rangeTo: number;
  inputRangeFrom: number = null;
  inputRangeTo: number = null;
  inputTimeStart: string;
  inputTimeEnd: string;
  param: string;
  date: Date = new Date();

  constructor(private route: ActivatedRoute,
              private ticketData: TicketData,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cookieService: CookieService,
              private commonService: CommonService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.route.queryParams.forEach((params: Params) => {
      if (params['time'] && params['time'] !== 'all') {
        this.time = params['time'];
        if (params['timeStart']) {
          this.timeStart = params['timeStart'];
          this.inputTimeStart = params['timeStart'];
        }
        if (params['timeEnd']) {
          this.timeEnd = params['timeEnd'];
          this.inputTimeEnd = params['timeEnd'];
        }
      } else {
        this.time = 'all';
      }

      if (params['price'] && params['price'] !== 'all') {
        this.price = params['price'];
        if (params['rangeFrom']) {
          this.rangeFrom = params['rangeFrom'];
        } else {
          this.rangeFrom = 0;
        }
        this.inputRangeFrom = this.rangeFrom;
        if (params['rangeTo']) {
          this.rangeTo = params['rangeTo'];
        } else {
          this.rangeTo = null;
        }
        this.inputRangeTo = this.rangeTo;
        this.priceType = this.rangeFrom + '-' + this.rangeTo;
      } else {
        this.price = 'all';
      }

      if (params['page']) {
        this.page = params['page'];
      } else {
        this.page = 1;
      }
    });

    this.paramConcact();
    this.getTickets();
  }

  chooseTime(type: string): void {
    if (type === 'period') {
      if (!this.inputTimeStart || !this.inputTimeEnd) {
        this.noticeService.setNotice('请输入时间段！');
        return;
      }
      this.timeStart = this.inputTimeStart;
      this.timeEnd = this.inputTimeEnd;
    } else {
      this.inputTimeStart = null;
      this.inputTimeEnd = null;
    }
    this.time = type;
    this.paramConcact();
    this.noticeService.setNotice();
    this.getTickets();
  }

  rangePrice(): void {
    if (!this.inputRangeFrom && !this.inputRangeTo) {
      this.noticeService.setNotice('请输入价格段！');
      return;
    }
    if (!this.inputRangeFrom) {
      this.inputRangeFrom = 0;
    }
    if (!this.inputRangeTo) {
      this.inputRangeTo = null;
    }
    if (this.inputRangeTo && this.inputRangeFrom >= this.inputRangeTo) {
      this.noticeService.setNotice('价格段错误！');
      return;
    }
    this.choosePrice('range', this.inputRangeFrom, this.inputRangeTo);
  }

  choosePrice(type: string, rangeFrom?: number, rangeTo?: number): void {
    this.price = type;
    if (!rangeFrom) {
      this.rangeFrom = 0;
    } else {
      this.rangeFrom = rangeFrom;
    }
    this.inputRangeFrom = this.rangeFrom;
    if (!rangeTo) {
      this.rangeTo = null;
    } else {
      this.rangeTo = rangeTo;
    }
    this.inputRangeTo = this.rangeTo;
    this.priceType = this.rangeFrom + '-' + this.rangeTo;
    this.paramConcact();
    this.noticeService.setNotice();
    this.getTickets();
  }

  paramConcact(): void {
    let timeParam, fakeTimeParam;
    if (this.time !== 'period') {
      timeParam = '&time=' + this.time;
      fakeTimeParam = '&time=' + this.time;
    } else {
      timeParam = '&time=' + this.time + '&timeStart=' + this.timeStart + ' 00:00:00&timeEnd=' + this.timeEnd + ' 00:00:00';
      fakeTimeParam = '&time=' + this.time + '&timeStart=' + this.timeStart + '&timeEnd=' + this.timeEnd;
    }
    let priceParam;
    if (this.price === 'all') {
      priceParam = '&price=all';
    } else {
      priceParam = '&price=range';
      if (this.rangeFrom != null) {
        priceParam = priceParam + '&rangeFrom=' + this.rangeFrom;
      }
      if (this.rangeTo != null) {
        priceParam = priceParam + '&rangeTo=' + this.rangeTo;
      }
    }
    let fakeParam;
    this.param = 'page=' + this.page + '&size=10&filter=true' + timeParam + priceParam;
    fakeParam = 'page=' + this.page + '&filter=true' + fakeTimeParam + priceParam;
    this.location.go(Setting.ROUTE_TICKET + '?' + fakeParam);
  }

  getTickets(): void {
    this.ticketData.getTickets(this.param)
      .subscribe(response => this.handleGetTickets(response),
        err => this.responseService.handleError(err));
  }

  gotoPage(page: number): void {
    this.page = page;
    this.paramConcact();
    this.noticeService.setNotice();
    this.getTickets();
  }

  handleGetTickets(response: RestResponse): void {
    this.waitTickets = true;
    switch (response.code) {
      case 2000:
        if (response.data.length) {
          this.pageMeta = response.meta;
          this.tickets = response.data;
          for (let i = 0; i < this.tickets.length; i++) {
            this.tickets[i].time = this.commonService.timeDuringFormat(this.tickets[i].ticketStartTime, this.tickets[i].ticketEndTime);

            // Check whether max price equal to min price
            if (this.tickets[i].maxNormalPrice - this.tickets[i].minNormalPrice) {
              this.tickets[i].price = '$' + this.tickets[i].minNormalPrice + ' - $' + this.tickets[i].maxNormalPrice;
            } else {
              this.tickets[i].price = '$' + this.tickets[i].minNormalPrice;
            }
          }

          this.hasTickets = true;
        } else {
          this.hasTickets = false;
        }
        this.noticeService.hideNotice();
        break;
      case 3201:
      case 3205:
      case 3206:
      default:
        this.hasTickets = false;
        this.responseService.handleResponse(response);
        break;
    }
  }

}
