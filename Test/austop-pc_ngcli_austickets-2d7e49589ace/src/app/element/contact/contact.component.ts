import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

import {Observable} from 'rxjs/Observable';

import {NoticeService} from '../../service/notice.service';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'contact',
  styleUrls: ['./contact.component.css'],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  setting = Setting;
  safeRight;

  constructor(private sanitizer: DomSanitizer,
              private noticeService: NoticeService) {
  }

  ngOnInit(): void {
  }

  show(): void {
    this.noticeService.setNotice(
      `<table class="m-contact-notice">
        <tr>
          <td><div class="u-icon u-icon-contact white u-icon-scan"></div></td>
          <td><img src="/assets/images/wechat_mobile.jpeg" width="185" height="185"></td>
        </tr>
        <tr>
          <td><div class="u-icon u-icon-contact white u-icon-wechat"></div></td>
          <td>
            <div class="title">微信客服</div>
            <div>AusTickets购票小助手</div>
            <div>Wechat ID: AusTickets_CS</div>
          </td>
        </tr>
        <tr>
          <td><div class="u-icon u-icon-contact white u-icon-mobile"></div></td>
          <td>
            <div class="title">电话客服</div>
            <div>02 8079 7000</div>
            <div>0451 566 511</div>
          </td>
        </tr>
        <tr>
          <td><div class="u-icon u-icon-contact white u-icon-email"></div></td>
          <td>
            <div class="title">邮件客服</div>
            <div>admin@austickets.com.au</div>
          </td>
        </tr>
        <tr>
          <td><div class="u-icon u-icon-contact white u-icon-time"></div></td>
          <td>
            <div class="title">咨询时间</div>
            <div>周一至周五， 11AM - 7PM</div>
          </td>
        </tr>
      </table>`);
  }
}
