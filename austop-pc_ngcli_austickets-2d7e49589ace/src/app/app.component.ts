import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';
import {CookieService} from 'ngx-cookie';

import {NoticeService} from './service/notice.service';

import {SettingData} from './data/setting.data';

import {SiteSetting} from './object/site-setting';

import {Setting} from './setting/setting';
import {Lang} from './setting/lang';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit, AfterViewInit {
  minHeight: SafeStyle;

  popupSettings: SiteSetting[];

  constructor(private router: Router,
              private noticeService: NoticeService,
              private cookieService: CookieService,
              private sanitizer: DomSanitizer,
              private settingData: SettingData) {
  }

  ngOnInit(): void {
    this.resize();

    Observable
      .fromEvent(window, 'resize')
      .throttleTime(100)
      .subscribe(e => {
        this.resize();
      });

    if (this.cookieService.get('userAccessToken')) {
      const date = new Date();
      setTimeout(() => {
        this.noticeService.setNotice('您的登陆时间已过期，系统将自动注销，若有需要请重新登陆！', [{
          id: 'notice-refresh'
        }]);
      }, Number(this.cookieService.get('userAccessTokenExpireAt')) - date.getTime());
    }
  }

  ngAfterViewInit() {
    if (!this.cookieService.get(Setting.K_TEMPORARY_INFO_READ)) {

      this.settingData.listByRoot('SITE_POPUP').subscribe(
        response => {
          
          if (response && response.code === 2000) {
            
            const data: SiteSetting[] = (response && response.data) || [];
            console.log('Popup to be displayed', JSON.stringify(data));

            const defaultSetting = new SiteSetting();
            const enabled = (data.find(s => s.dataKey === 'SITE_POPUP_ENABLED') || defaultSetting).dataValue === 'true';
            const title = (data.find(s => s.dataKey === 'SITE_POPUP_TITLE') || defaultSetting).dataValue;
            const content = (data.find(s => s.dataKey === 'SITE_POPUP_CONTENT') || defaultSetting).dataValue;
            const btnText = (data.find(s => s.dataKey === 'SITE_POPUP_BUTTON_TEXT') || defaultSetting).dataValue;
            const btnLink = (data.find(s => s.dataKey === 'SITE_POPUP_BUTTON_LINK') || defaultSetting).dataValue;

            if (enabled) {
              const btns: any = [{string: Lang.CN.Confirm, id: 'notice-alert'}];
              if (btnText && btnLink) {
                btns.push({string: btnText, id: 'notice-popup', target: btnLink})
              }
              this.noticeService.setNotice(
                `
                <div class="frame-wrapper">
                  <h4>${title}</h4>
                  <p>${content}</p>
                </div>
                `,
                btns
              );
              this.cookieService.put(Setting.K_TEMPORARY_INFO_READ, '1');
            }
          } else {
            console.warn('Invalid response for popup', JSON.stringify(response));
          }
        },
        err => console.warn('Error when fetching popup message', JSON.stringify(err))
      );
    }
  }

  resize(): void {
    this.minHeight = this.sanitizer.bypassSecurityTrustStyle(`${window.document.documentElement.clientHeight - 100 - 50}px`);
  }
}
