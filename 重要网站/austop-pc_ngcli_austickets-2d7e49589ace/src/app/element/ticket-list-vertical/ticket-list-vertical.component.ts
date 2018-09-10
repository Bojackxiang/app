import {Component, OnInit, Input} from '@angular/core';

import {Ticket} from '../../object/ticket';

import {Setting} from '../../setting/setting';

@Component({
    selector: 'ticket-list-vertical',
    templateUrl: './ticket-list-vertical.component.html'
})

export class TicketListVerticalComponent implements OnInit {
    setting = Setting;
    date: Date = new Date();

    @Input()
    tickets: Ticket[] = [];

    constructor() {

    }

    ngOnInit() {

    }
}