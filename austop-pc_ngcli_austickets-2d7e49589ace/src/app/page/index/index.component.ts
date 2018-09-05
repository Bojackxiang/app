import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {ResponseService} from '../../service/response.service';

import {CategoryData} from '../../data/category.data';

import {Category} from '../../object/category';
import {RestResponse} from '../../object/rest-response';

@Component({
  selector: 'index',
  styleUrls: ['./index.component.css'],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  ticketCategories: Category[] = [];
  eventCategories: Category[] = [];

  constructor(private router: Router,
              private categoryData: CategoryData,
              private responseService: ResponseService) {
  }

  ngOnInit(): void {
    this.categoryData.listTicketCats().subscribe(
      response => this.handleListTicketCatsResponse(response),
      err => this.responseService.handleError(err)
    );
    this.categoryData.listEventCats().subscribe(
      response => this.handleListEventCatsResponse(response),
      err => this.responseService.handleError(err)
    );
  }

  private handleListTicketCatsResponse(response: RestResponse): void {
    if (response && response.code === 2000) {
      this.ticketCategories = response && response.data;
    } else {
      this.responseService.handleResponse(response);
    }
  }

  private handleListEventCatsResponse(response: RestResponse): void {
    if (response && response.code === 2000) {
      this.eventCategories = response && response.data;
    } else {
      this.responseService.handleResponse(response);
    }
  }
}
