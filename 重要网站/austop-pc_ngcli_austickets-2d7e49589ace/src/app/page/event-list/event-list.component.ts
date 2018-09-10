import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {EventData} from '../../data/event.data';

import {RestResponse} from '../../object/rest-response';
import {Event} from '../../object/event';
import {PageMeta} from '../../object/page-meta';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'event-list',
  styleUrls: ['./event-list.component.css'],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {
  setting = Setting;
  events: Event[];
  pageMeta: PageMeta;
  waitEvents: boolean;
  hasEvents: boolean;
  page: number;
  time: string;
  timeStart: string;
  timeEnd: string;
  inputTimeStart: string;
  inputTimeEnd: string;
  param: string;

  constructor(private route: ActivatedRoute,
              private noticeService: NoticeService,
              private cookieService: CookieService,
              private commonService: CommonService,
              private responseService: ResponseService,
              private location: Location,
              private router: Router,
              private eventData: EventData) {
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
      if (params['page']) {
        this.page = params['page'];
      } else {
        this.page = 1;
      }
    });

    this.paramConcact();
    this.getEvents();
  }

  gotoPage(page: number): void {
    this.page = page;
    this.paramConcact();
    this.noticeService.setNotice();
    this.getEvents();
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
    this.getEvents();
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
    let fakeParam;
    this.param = 'page=' + this.page + '&size=10&filter=true' + timeParam;
    fakeParam = 'page=' + this.page + '&filter=true' + fakeTimeParam;
    this.location.go(Setting.ROUTE_EVENT + '?' + fakeParam);
  }

  getEvents(): void {
    this.eventData.getEvents(this.param)
      .subscribe(response => this.handleGetEvents(response),
        err => this.responseService.handleError(err));
  }

  handleGetEvents(response: RestResponse): void {
    this.waitEvents = true;
    switch (response.code) {
      case 2000:
        this.pageMeta = response.meta;
        if (response.data.length) {
          this.events = response.data;
          for (let i = 0; i < this.events.length; i++) {
            this.events[i].time = this.commonService.timeDuringFormat(this.events[i].eventStartAt, this.events[i].eventEndAt);
          }
          this.hasEvents = true;
        } else {
          this.hasEvents = false;
        }
        this.noticeService.hideNotice();
        break;
      case 3201:
      case 3205:
      case 3206:
      default:
        this.hasEvents = false;
        this.responseService.handleResponse(response);
        break;
    }
  }
}
