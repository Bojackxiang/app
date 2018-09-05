import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CategoryData} from '../../data/category.data';

import {RestResponse} from '../../object/rest-response';
import {Category} from '../../object/category';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'header-section',
  styleUrls: ['./header.component.css'],
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
  setting = Setting;

  ticketCats: Category[] = [];
  eventCats: Category[] = [];

  constructor(private router: Router,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private categoryData: CategoryData) {
  }

  ngOnInit(): void {
    this.listTicketCats();
  }

  listTicketCats(): void {
    this.categoryData.listTicketCats().subscribe(
      response => this.handleListTicketCatsResponse(response),
      err => this.responseService.handleError(err)
    );
  }

  private handleListTicketCatsResponse(response: RestResponse): void {
    if (!response || response.code !== 2000) {
      return this.responseService.handleResponse(response);
    }
    this.ticketCats = response && response.data;
    this.listEventCats();
  }

  listEventCats(): void {
    this.categoryData.listEventCats().subscribe(
      response => this.handleListEventCatsResponse(response),
      err => this.responseService.handleError(err)
    );
  }

  private handleListEventCatsResponse(response: RestResponse): void {
    if (!response || response.code !== 2000) {
      return this.responseService.handleResponse(response);
    }
    this.eventCats = response && response.data;
  }

  wechat(): void {
    this.noticeService.setNotice(`<img src="/assets/images/wechat.jpeg" width="200" height="200">
      <br><br>微信客服<br><br>悉尼星魔方<br><br>Wechat ID: AusTopEvents<br><br>周一至周五，11AM-7PM`);
  }
}
