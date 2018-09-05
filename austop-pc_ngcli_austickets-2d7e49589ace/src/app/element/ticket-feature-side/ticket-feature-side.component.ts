import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {TicketData} from '../../data/ticket.data';

import {RestResponse} from '../../object/rest-response';
import {Ticket} from '../../object/ticket';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'ticket-feature-side',
  styleUrls: ['../../style/feature-side.component.css'],
  templateUrl: './ticket-feature-side.component.html',
})
export class TicketFeatureSideComponent implements OnInit {
  setting = Setting;
  tickets: Ticket[];

  constructor(private router: Router,
              private ticketData: TicketData) {
  }

  ngOnInit(): void {
    this.ticketData.getTickets('featured=true&page=1&size=2')
      .subscribe(response => this.handleGetTickets(response),
        err => {
        });
  }

  handleGetTickets(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.tickets = response.data;
        break;
    }
  }
}
