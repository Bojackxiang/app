import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';

import {ResponseService} from '../../service/response.service';
import {CommonService} from '../../service/common.service';

import {EventData} from '../../data/event.data';

import {Event} from '../../object/event';
import {RestResponse} from '../../object/rest-response';
import {PageMeta} from '../../object/page-meta';

import {Setting} from '../../setting/setting';

@Component({
    selector: 'event-list-category',
    templateUrl: './event-list-category.component.html'
})

export class EventListCategoryComponent implements OnInit {
    categoryName = '';
    private categoryNameSalt = '';

    categoryEvents: Event[] = [];

    page = 1;
    size = 10;
    pageMeta: PageMeta = new PageMeta();

    constructor(private route: ActivatedRoute,
                private location: Location,
                private responseService: ResponseService,
                private commonService: CommonService,
                private eventData: EventData) {

    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.categoryName = params['category'];
            this.categoryNameSalt = params['salt'];
            this.page = params['page'] || 1;
            this.listCategoryEvents();
        });
    }

    listCategoryEvents(): void {
        this.location.go(`${Setting.ROUTE_EVENT}/category/${this.categoryName}/?page=${this.page}&salt=${this.categoryNameSalt || ''}`);
        this.eventData.getCategoryEvents(this.categoryName, this.page, this.size).subscribe(
            response => this.handleListCategoryEventsResponse(response),
            err => this.responseService.handleError(err)
        );
    }

    private handleListCategoryEventsResponse(response: RestResponse): void {
        if (response && response.code === 2000) {
            this.categoryEvents = (response && response.data || []).map((event: Event) => {
                event.time = this.commonService.timeDuringFormat(event.eventStartAt, event.eventEndAt);
                return event;
            });
            this.pageMeta = response && response.meta;
        } else {
            this.responseService.handleResponse(response);
        }
    }

    gotoPage(page: number): void {
        this.page = page;
        this.listCategoryEvents();
    }
}