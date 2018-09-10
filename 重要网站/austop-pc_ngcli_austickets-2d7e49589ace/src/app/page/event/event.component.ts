import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';

import {EventData} from '../../data/event.data';

import {RestResponse} from '../../object/rest-response';
import {Event} from '../../object/event';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit {
  setting = Setting;
  event: Event;
  eventArticle;

  constructor(private route: ActivatedRoute,
              private eventData: EventData,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private commonService: CommonService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const eventCode: string = params['eventCode'];
      this.eventData.getEvent(eventCode)
        .subscribe(response => this.handleGetEvent(response),
          err => this.responseService.handleError(err));
    });
  }

  handleGetEvent(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.event = response.data;
        this.event.time = this.commonService.timeDuringFormat(this.event.eventStartAt, this.event.eventEndAt);

        if (this.event.eventHtmlContent) {
          if (this.event.eventHtmlContent.contentHtml) {
            this.eventArticle = this.sanitizer.bypassSecurityTrustHtml(this.event.eventHtmlContent.contentHtml);
          }
        }
        break;
      case 1000:
      case 1404:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }
}
