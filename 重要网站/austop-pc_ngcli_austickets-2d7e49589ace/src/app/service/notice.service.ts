import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {NoticeComponent} from '../element/notice/notice.component';

@Injectable()
export class NoticeService {
  notice: NoticeComponent;

  constructor() {
  }

  init(notice: NoticeComponent): void {
    this.notice = notice;
  }

  button(id: string): Observable<any> {
    const buttonDom = <HTMLElement> document.querySelector(`#${id}`);
    return Observable
      .fromEvent(buttonDom, 'click')
      .take(1);
  }

  setNotice(body?: string, control?: any[]): void {
    if (!body) {
      body = null;
    }
    if (!control) {
      control = null;
    }
    this.notice.setNotice(body, control);
  }

  hideNotice(): void {
    this.notice.hideNotice();
  }

  setCover(): void {
    this.notice.showCover();
  }

  hideCover(): void {
    this.notice.hideCover();
  }
}
