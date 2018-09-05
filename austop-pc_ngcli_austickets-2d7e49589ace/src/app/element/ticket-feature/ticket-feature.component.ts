import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';

import {CommonService} from '../../service/common.service';
import {ResponseService} from '../../service/response.service';

import {TicketData} from '../../data/ticket.data';

import {RestResponse} from '../../object/rest-response';
import {Ticket} from '../../object/ticket';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'ticket-feature',
  templateUrl: './ticket-feature.component.html',
})
export class TicketFeatureComponent implements OnInit {
  setting = Setting;
  tickets: Ticket[];

  @Input()
  ticketCategoryName = '';

  private page = 1;
  private size = 4;

  constructor(private router: Router,
              private ticketData: TicketData,
              private commonService: CommonService,
              private responseService: ResponseService) {
  }

  ngOnInit(): void {
    this.ticketData.getCategoryTickets(this.ticketCategoryName, this.page, this.size).subscribe(
      response => this.handleGetTickets(response),
      err => this.responseService.handleError(err)
    );
  }

  private handleGetTickets(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.tickets = response.data;
        for (let i = 0; i < this.tickets.length; i++) {
          this.tickets[i].time = this.commonService.timeDuringFormat(this.tickets[i].ticketStartTime, this.tickets[i].ticketEndTime);
        }
        break;
      default: 
        this.responseService.handleResponse(response)
        break;
    }
  }
}
