import {Component, OnInit, Input} from '@angular/core';

import {Event} from '../../object/event';

import {Setting} from '../../setting/setting';

@Component({
    selector: 'event-list-vertical',
    templateUrl: './event-list-vertical.component.html'
})

export class EventListVerticalComponent implements OnInit {
    @Input()
    events: Event[] = [];

    setting = Setting;

    constructor() {

    }

    ngOnInit() {

    }
}