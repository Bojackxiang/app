import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';

import {CommonService} from '../../service/common.service';
import {ResponseService} from '../../service/response.service';

import {EventData} from '../../data/event.data';

import {RestResponse} from '../../object/rest-response';
import {Event} from '../../object/event';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'event-feature',
  templateUrl: './event-feature.component.html',
})
export class EventFeatureComponent implements OnInit {
  setting = Setting;
  events: Event[];

  page = 1;
  size = 3; // only display 3 events on a row

  @Input()
  eventCategoryName = '';

  constructor(private router: Router,
              private eventData: EventData,
              private commonService: CommonService,
              private responseService: ResponseService) {
  }

  ngOnInit(): void {
    this.eventData.getCategoryEvents(this.eventCategoryName, this.page, this.size).subscribe(
      response => this.handleGetEvents(response),
      err => this.responseService.handleError(err)
    );
  }

  private handleGetEvents(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.events = response.data;
        for (let i = 0; i < this.events.length; i++) {
          this.events[i].time = this.commonService.timeDuringFormat(this.events[i].eventStartAt, this.events[i].eventEndAt);
        }
        break;
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }
}
