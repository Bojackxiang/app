import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {NoticeService} from './notice.service';
import {CookieService} from 'ngx-cookie';

import {RestResponse} from '../object/rest-response';

import {Lang} from '../setting/lang';

@Injectable()
export class ResponseService {
  constructor(private cookieService: CookieService,
              private noticeService: NoticeService) {
  }

  result(response: Response): RestResponse {
    switch (response.status) {
      case 200:
        return response.json();
      default:
        console.log(response);
        break;
    }
  }

  error(err: any): Observable<RestResponse> {
    return Observable.throw(err);
  }

  handleResponse(response: RestResponse): void {
    switch (response.code) {
      case 1000:
      case 1404:
        this.noticeService.setNotice('该活动不存在！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 3000:
      case 3404:
        this.noticeService.setNotice('该活动不存在！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 3205:
      case 3206:
        this.noticeService.setNotice('筛选区间错误！');
        break;
      case 3201:
      case 3210:
        this.noticeService.setNotice('筛选日期格式错误！请按照YYYY-MM-DD的格式填写！');
        break;
      case 4000:
        this.noticeService.setNotice('用户账号错误！');
        break;
      case 4003:
        this.noticeService.setNotice('Email格式错误！');
        break;
      case 4004:
        this.noticeService.setNotice('密码长度应位于8-36位！');
        break;
      case 4005:
        this.noticeService.setNotice('该邮箱已注册！');
        break;
      case 4007:
        this.noticeService.setNotice('请填写邮箱！');
        break;
      case 4008:
      case 4009:
        this.noticeService.setNotice('密码错误！');
        break;
      case 4010:
      case 4012:
        this.noticeService.setNotice('旧密码错误！');
        break;
      case 4011:
      case 4034:
        this.noticeService.setNotice('密码不合法！密码长度应在8-36位之间！');
        break;
      case 4013:
        this.noticeService.setNotice('请填写名');
        break;
      case 4014:
        this.noticeService.setNotice('请填写姓');
        break;
      case 4015:
        this.noticeService.setNotice('请填写电话');
        break;
      case 4016:
        this.noticeService.setNotice('请填写微信');
        break;
      case 4017:
        this.noticeService.setNotice('请填写QQ');
        break;
      case 4018:
        this.noticeService.setNotice('请填写地址');
        break;
      case 4019:
        this.noticeService.setNotice('请填写区');
        break;
      case 4020:
        this.noticeService.setNotice('请选择州 State！');
        break;
      case 4021:
        this.noticeService.setNotice('请填写国家');
        break;
      case 4022:
        this.noticeService.setNotice('请填写邮编');
        break;
      case 4023:
        this.noticeService.setNotice('用户更新页面过期');
        break;
      case 4024:
      case 4027:
        this.noticeService.setNotice('Email验证链接错误！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4026:
        this.noticeService.setNotice('Email已通过验证！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4030:
      case 4031:
      case 4032:
        this.noticeService.setNotice('重置密码链接错误！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4033:
        this.noticeService.setNotice('重置密码链接已过期！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 4404:
        this.noticeService.setNotice('该邮箱未用于注册！用户不存在');
        break;
      case 6401:
      case 6460:
      case 6461:
      case 6462:
      case 6463:
      case 6464:
        this.cookieService.remove('cartCode');
        this.cookieService.remove('userAccessToken');
        this.cookieService.remove('userCode');
        this.cookieService.remove('userEmail');
        this.cookieService.remove('userAccessTokenExpireAt');
        this.noticeService.setNotice(
          '登陆已过期，请重新登陆！', [{
            id: 'notice-link-default'
          }]
        );
        break;
      case 7000:
      case 7404:
        this.noticeService.setNotice('该订单不存在！', [{
          id: 'notice-link-default'
        }]);
        break;
      case 7002:
        this.noticeService.setNotice('订单金额错误！');
        break;
      case 7003:
        this.noticeService.setNotice('请检查您用于取票的Email！');
        break;
      case 7004:
        this.noticeService.setNotice('请检查您用于取票的名字！');
        break;
      case 7005:
        this.noticeService.setNotice('请检查您用于取票的姓氏！');
        break;
      case 7006:
        this.noticeService.setNotice('请检查您用于取票的电话号码！');
        break;
      case 7007:
        this.noticeService.setNotice('请检查您用于取票的详细地址信息！');
        break;
      case 7008:
        this.noticeService.setNotice('请检查您用于取票的地址区域信息！');
        break;
      case 7009:
        this.noticeService.setNotice('请检查您用于取票的州信息！');
        break;
      case 7010:
        this.noticeService.setNotice('请检查您用于取票的国家信息！');
        break;
      case 7011:
        this.noticeService.setNotice('请检查您用于取票的邮编信息！');
        break;
      case 7018:
        this.noticeService.setNotice('订单金额计算错误！');
        break;
      case 7019:
        this.noticeService.setNotice('礼品卡使用过多导致订单金额为负！');
        break;
      case 7020:
        this.noticeService.setNotice('订单中有商品已下线！');
        break;
      case 7025:
        this.noticeService.setNotice('该订单已无需支付', [{
          id: 'notice-link-default'
        }]);
        break;
      case 7604:
        this.noticeService.setNotice('购物车数量输入错误！');
        break;
      case 7605:
        this.noticeService.setNotice('库存不足！若欲购数量小于显示库存，请检查购物车！');
        break;
      case 7606:
        this.noticeService.setNotice('商品ID错误！');
        break;
      case 7608:
        this.noticeService.setNotice('该票已下架！');
        break;
      case 8000:
        this.noticeService.setNotice('礼品卡格式错误！');
        break;
      case 8002:
        this.noticeService.setNotice('礼品卡余额已用尽！');
        break;
      case 8003:
        this.noticeService.setNotice('该礼品卡暂未开放使用！');
        break;
      case 8004:
        this.noticeService.setNotice('该礼品卡已过期！');
        break;
      case 8006:
        this.noticeService.setNotice('礼品卡错误！');
        break;
      case 8404:
        this.noticeService.setNotice('该礼品卡不存在！');
        break;
      case 8100:
      case 8440:
        this.noticeService.setNotice(Lang.CN.WrongCoupon);
        break;
      case 8102:
        this.noticeService.setNotice('优惠券已被使用！');
        break;
      case 8103:
        this.noticeService.setNotice('优惠券暂未开放使用！');
        break;
      case 8104:
        this.noticeService.setNotice('优惠券已过期！');
        break;
      case 8106:
        this.noticeService.setNotice('优惠券错误！');
        break;
      case 8600:
        this.noticeService.setNotice('优惠日期错误！');
        break;
      case 8601:
        this.noticeService.setNotice('优惠数量错误！');
        break;
      default:
        console.log(response);
        this.noticeService.setNotice(Lang.CN.SystemError);
        break;
    }
  }

  handleError(err): void {
    this.noticeService.setNotice('网络联接错误！请检查您的网络信号！');
  }
}
