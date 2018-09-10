import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {EventData} from '../../data/event.data';

import {RestResponse} from '../../object/rest-response';
import {Event} from '../../object/event';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'event-feature-side',
  styleUrls: ['../../style/feature-side.component.css'],
  templateUrl: './event-feature-side.component.html',
})
export class EventFeatureSideComponent implements OnInit {
  setting = Setting;
  events: Event[];

  constructor(private router: Router,
              private eventData: EventData) {
  }

  ngOnInit(): void {
    this.eventData.getEvents('featured=true&page=1&size=2')
      .subscribe(response => this.handleGetEvents(response),
        err => {
        });
  }

  handleGetEvents(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.events = response.data;
        break;
    }
  }
}
