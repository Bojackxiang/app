import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';

import {ResponseService} from '../../service/response.service';
import {CommonService} from '../../service/common.service';

import {TicketData} from '../../data/ticket.data';

import {RestResponse} from '../../object/rest-response';
import {Ticket} from '../../object/ticket';
import {PageMeta} from '../../object/page-meta';

import {Setting} from '../../setting/setting';

@Component({
    selector: 'ticket-list-category',
    templateUrl: './ticket-list-category.component.html'
})

export class TicketListCategoryComponent implements OnInit {
    categoryName = '';
    categoryNameSalt = '';

    categoryTickets: Ticket[] = [];
    pageMeta: PageMeta = new PageMeta();
    page = 1;
    size = 10;

    constructor(private route: ActivatedRoute,
                private ticketData: TicketData,
                private responseService: ResponseService,
                private commonService: CommonService,
                private location: Location) {
        
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.categoryName = params['category'];
            this.categoryNameSalt = params['salt'];
            this.page = params['page'] || 1;
            this.listCategoryTickets();
        });
    }

    listCategoryTickets(): void {
        this.location.go(`${Setting.ROUTE_TICKET}/category/${this.categoryName}/?page=${this.page}&salt=${this.categoryNameSalt || ''}`);
        this.ticketData.getCategoryTickets(this.categoryName, this.page, this.size).subscribe(
            response => this.handleListCategoryTicketsResponse(response),
            err => this.responseService.handleError(err)
        );
    }

    private handleListCategoryTicketsResponse(response: RestResponse): void {
        if (response && response.code === 2000) {
            this.categoryTickets = response && response.data;
            for (let i = 0; i < this.categoryTickets.length; i++) {
                this.categoryTickets[i].time = this.commonService.timeDuringFormat(this.categoryTickets[i].ticketStartTime, this.categoryTickets[i].ticketEndTime);
    
                // Check whether max price equal to min price
                if (this.categoryTickets[i].maxNormalPrice - this.categoryTickets[i].minNormalPrice) {
                  this.categoryTickets[i].price = '$' + this.categoryTickets[i].minNormalPrice + ' - $' + this.categoryTickets[i].maxNormalPrice;
                } else {
                  this.categoryTickets[i].price = '$' + this.categoryTickets[i].minNormalPrice;
                }
              }
            this.pageMeta = response && response.meta;
        } else {
            this.responseService.handleResponse(response);
        }
    }

    gotoPage(page: number) {
        this.page = page;
        this.listCategoryTickets();
    }
}