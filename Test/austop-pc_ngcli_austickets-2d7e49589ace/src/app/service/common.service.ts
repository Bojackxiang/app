import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {NoticeService} from './notice.service';
import {CookieService} from 'ngx-cookie';

import {Setting} from '../setting/setting';

@Injectable()
export class CommonService {
  constructor(private cookieService: CookieService,
              private noticeService: NoticeService) {
  }

  public get isLogin(): boolean {
    if (this.cookieService.get('userAccessTokenExpireAt')) {
      return true;
    } else {
      return false;
    }
  }

  iframe(html: string): void {
    switch (html) {
      case 'privacy':
        this.noticeService.setNotice(
          `<div class='frame-wrapper'>
                ${Setting.INFO_PRIVACY}
              </div>`);
        break;
      case 'refund':
        this.noticeService.setNotice(
          `<div class='frame-wrapper'>
                ${Setting.INFO_REFUND}
                </div>`);
        break;
      default:
        break;
    }
  }

  timeFormat(start: number): string {
    const dateStart = new Date(start);

    // YYYY.MM.DD hh:mm
    const year = dateStart.getFullYear();
    const month = this.xxFormat(dateStart.getMonth() + 1);
    const day = this.xxFormat(dateStart.getDate());
    const time = this.meridiemFormat(dateStart.getHours(), dateStart.getMinutes());
    return `${year}.${month}.${day} ${time}`;
  }

  timeDuringFormat(start: number, end: number): string {
    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    let callback: string;

    // YYYY.MM.DD
    callback = `${dateStart.getFullYear()}.${this.xxFormat(dateStart.getMonth() + 1)}.${this.xxFormat(dateStart.getDate())}`;

    if (dateStart.getFullYear() !== dateEnd.getFullYear()
      || dateStart.getMonth() !== dateEnd.getMonth()
      || dateStart.getDate() !== dateEnd.getDate()) {
      // 不同日期
      if (dateStart.getFullYear() !== dateEnd.getFullYear()) {
        // 不同年 YYYY.MM.DD - YYYY.MM.DD
        callback = `${callback} - ${dateEnd.getFullYear()}.${this.xxFormat(dateEnd.getMonth() + 1)}.${this.xxFormat(dateEnd.getDate())}`;
      } else {

        // 同年 YYYY.MM.DD - MM.DD
        callback = `${callback} - ${this.xxFormat(dateEnd.getMonth() + 1)}.${this.xxFormat(dateEnd.getDate())}`;
      }
    } else {
      // 相同日期
      if (dateStart.getHours() !== dateEnd.getHours() || dateStart.getMinutes() !== dateEnd.getMinutes()) {
        // 不同时间 YYYY.MM.DD HH:MM - HH:MM
        callback = [
          `${callback}   ${this.meridiemFormat(dateStart.getHours(), dateStart.getMinutes())}`,
          ' - ',
          `${this.meridiemFormat(dateEnd.getHours(), dateEnd.getMinutes())}`].join('');
      } else {
        // 非0点0分 YYYY.MM.DD HH:MM
        if (dateStart.getHours() !== 0 || dateStart.getMinutes() !== 0) {
          callback = `${callback}   ${this.meridiemFormat(dateStart.getHours(), dateStart.getMinutes())}`;
        }
      }
    }
    return callback;
  }

  xxFormat(x: number): string {
    if (x.toString().length === 2) {
      return x.toString();
    } else {
      return `0${x}`;
    }
  }

  meridiemFormat(h: number, m: number): string {
    if (h === 0) {
      return `12:${this.xxFormat(m)} AM`;
    }
    if (h > 0 && h < 12) {
      return `${h}:${this.xxFormat(m)} AM`;
    }
    if (h === 12) {
      return `12:${this.xxFormat(m)} PM`;
    }
    if (h > 12) {
      return `${(h - 12)}:${this.xxFormat(m)} PM`;
    }
  }

  orderStatus(id: number): string {
    switch (id) {
      case 0:
        return '订单取消';
      case 1:
        return '支付过期';
      case 2:
      case 8:
      case 10:
        return '等候支付';
      case 3:
      case 7:
      case 9:
        return '确认支付';
      case 6:
        return '订单关闭';
      case 5:
        return '订单完成';
      case 4:
        return '订单送达';
    }
  }
}
