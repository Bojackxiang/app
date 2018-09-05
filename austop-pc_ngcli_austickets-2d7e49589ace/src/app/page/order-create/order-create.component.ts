import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {CommonService} from '../../service/common.service';
import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {CartData} from '../../data/cart.data';
import {CouponData} from '../../data/coupon.data';
import {GiftcardData} from '../../data/giftcard.data';
import {OrderData} from '../../data/order.data';
import {UserData} from '../../data/user.data';

import {RestResponse} from '../../object/rest-response';
import {Cart} from '../../object/cart';
import {CartItem} from '../../object/cart-item';
import {Coupon} from '../../object/coupon';
import {Delivery} from '../../object/delivery';
import {Giftcard} from '../../object/giftcard';
import {PickUp} from '../../object/pickUp';
import {UserInformation} from '../../object/user-information';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'order-create',
  styleUrls: ['./order-create.component.css'],
  templateUrl: './order-create.component.html',
})
export class OrderCreateComponent implements OnInit {
  setting = Setting;
  cart: Cart;
  items: any[] = [];
  cartTotalPrice = 0;
  payPrice = 0;
  couponCode: string;   // input
  coupon: Coupon;
  usedCouponCode: string; // selected
  couponUseAmount = 0;
  giftcardCode: string; // input
  giftcard: Giftcard;            // temp
  usedGiftcard: Giftcard[] = []; // selected
  orderPS: string;      // input
  userInformation: UserInformation;
  lastname: string;     // input
  address: string;      // input
  firstname: string;    // input
  suburb: string;       // input
  email: string;        // input
  phone: string;        // input
  state: string;        // input
  zipcode: string;      // input
  policyAgreement: boolean;
  outOfStock: boolean;
  outOfStockItems: CartItem[] = [];

  // Pickups information
  pickUps: PickUp[];
  allPickUps: PickUp[];
  pickUpState = 'NSW';


  deliveries: Delivery[];
  chosePickUp: PickUp; // selected
  choseDelivery: Delivery; // selected
  deliveryPrice = 0;
  shippingOption = 'pickUp';

  constructor(private router: Router,
              private cookieService: CookieService,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private userData: UserData,
              private cartData: CartData,
              private couponData: CouponData,
              private giftcardData: GiftcardData,
              private orderData: OrderData,
              private commonService: CommonService) {
  }

  ngOnInit(): void {
    if (this.cookieService.get('userAccessToken')) {
      this.userData.getUser(this.cookieService.get('userCode'))
        .subscribe(response => this.handleGetUser(response),
          err => this.responseService.handleError(err));
    }
    if (this.cookieService.get('cartCode')) {
      this.cartData.getCart(this.cookieService.get('cartCode'))
        .subscribe(response => this.handleGetCart(response),
          err => this.responseService.handleError(err));
      this.orderData.getPickUp()
        .subscribe(response => this.handleGetPickUp(response),
          err => this.responseService.handleError(err));
      this.orderData.getDelivery()
        .subscribe(response => this.handleGetDelivery(response),
          err => this.responseService.handleError(err));
    } else {
      this.router.navigate(['/']);
    }

  }

  handleGetUser(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.userInformation = response.data;

        this.lastname = this.userInformation.userLastName;
        this.address = this.userInformation.userAddress;
        this.firstname = this.userInformation.userFirstName;
        this.suburb = this.userInformation.userSuburb;
        this.email = this.userInformation.userEmail;
        this.phone = this.userInformation.userPhone;
        this.state = this.userInformation.userState;
        this.zipcode = this.userInformation.userZipCode;
        break;

      default:
        break;
    }
  }

  handleGetCart(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.cart = response.data;
        if (!this.cart.cartItems.length) {
          this.noticeService.setNotice('购物车无商品，请先添加商品！', [{
            id: 'notice-link-default'
          }]);
          return;
        }
        for (let i = 0; i < this.cart.cartItems.length; i++) {
          this.items.push({
            relTicketType: this.cart.cartItems[i].itemRef,
            relTicketQuantity: this.cart.cartItems[i].itemQuantity,
            relTicketTypeSubtotal: this.cart.cartItems[i].itemTotalPrice
          });
          this.cartTotalPrice += this.cart.cartItems[i].itemTotalPrice;
        }
        this.cartTotalPrice = Number(this.cartTotalPrice.toFixed(2));
        this.payPrice = this.cartTotalPrice;
        break;
      case 7640:
        this.cookieService.remove('cartCode');
        this.noticeService.setNotice('购物车无商品，请先添加商品！', [{
          id: 'notice-link-default'
        }]);
        break;
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  handleGetPickUp(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        // this.pickUps = response.data;
        // pick all locations, and put them into filter, and get pickUpsg
        this.allPickUps = response.data;
        this.pickUps = this.allPickUps.filter(p => p.pointState === this.pickUpState || []);
        this.chosePickUp = this.pickUps[0];
        break;
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  handleGetDelivery(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.deliveries = response.data;
        break;
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  selectShippingOption(type: string): void {
    this.shippingOption = type;
    switch (type) {
      case 'pickUp':
        this.chosePickUp = this.pickUps[0];
        this.deliveryPrice = 0;
        this.choseDelivery = null;
        break;
      case 'delivery':
        this.choseDelivery = this.deliveries[0];
        this.deliveryPrice = this.choseDelivery.deliveryOptionFee;
        this.chosePickUp = null;
        break;
    }
    this.refreshPayPrice();
  }

  selectDelivery(delivery: Delivery): void {
    this.choseDelivery = delivery;
    this.deliveryPrice = this.choseDelivery.deliveryOptionFee;
    this.refreshPayPrice();
  }

  selectPickUp(pickUp: PickUp): void {
    this.chosePickUp = pickUp;
  }

  useCoupon(): void {

    if (!this.couponCode) {
      this.noticeService.setNotice('请输入优惠券！');
      return;
    }
    this.noticeService.setNotice();
    this.couponData.getCoupon(this.couponCode)
      .subscribe(response => this.handleGetCoupon(response),
        err => this.responseService.handleError(err));
  }

  cancelCoupon(): void {
    this.coupon = null;
    this.couponCode = '';
    this.usedCouponCode = '';
    this.refreshGiftcard();
  }

  refreshPayPrice(): void {
    if (this.coupon) {
      this.calculateCouponUseAmount();
    } else {
      this.couponUseAmount = 0;
    }

    this.payPrice = this.cartTotalPrice + this.deliveryPrice - this.couponUseAmount;
    this.payPrice = Number(this.payPrice.toFixed(2));

    this.refreshGiftcard();
  }

  useGiftcard(): void {
    if (!this.payPrice) {
      this.noticeService.setNotice('订单应付金额已为0，无需使用礼品卡！');
      return;
    }
    if (!this.giftcardCode) {
      this.noticeService.setNotice('请输入礼品卡！');
      return;
    }
    for (let i = 0; i < this.usedGiftcard.length; i++) {
      if (this.giftcardCode === this.usedGiftcard[i].discountCode) {
        this.noticeService.setNotice('礼品卡已使用！');
        return;
      }
    }
    this.noticeService.setNotice();
    this.giftcardData.getGiftcard(this.giftcardCode)
      .subscribe(response => this.handleGetGiftcard(response),
        err => this.responseService.handleError(err));
  }

  cancelGiftcard(giftcard: Giftcard): void {
    this.payPrice = this.cartTotalPrice + this.deliveryPrice - this.couponUseAmount;
    this.payPrice = Number(this.payPrice.toFixed(2));
    for (let i = 0; i < this.usedGiftcard.length; i++) {
      if (this.usedGiftcard[i] === giftcard) {
        this.usedGiftcard.splice(i, 1);
      }
    }
    this.refreshGiftcard();
  }

  refreshGiftcard(): void {
    for (let i = 0; i < this.usedGiftcard.length; i++) {
      if (!this.payPrice) {
        this.usedGiftcard.splice(i, this.usedGiftcard.length - i);
        return;
      } else {
        if (this.usedGiftcard[i].giftCardRemainAmount >= this.payPrice) {
          this.usedGiftcard[i].giftCardUseAmount = this.payPrice;
        } else {
          this.usedGiftcard[i].giftCardUseAmount = this.usedGiftcard[i].giftCardRemainAmount;
        }

        this.payPrice -= this.usedGiftcard[i].giftCardUseAmount;
        this.payPrice = Number(this.payPrice.toFixed(2));
      }
    }
  }

  submitOrder(): void {
    if (!this.shippingOption) {
      this.noticeService.setNotice('请选择取票方式！');
      return;
    }
    if (!this.policyAgreement) {
      this.noticeService.setNotice('请阅读并同意送货及退款政策！');
      return;
    }
    if (!this.email || !this.phone || !this.firstname || !this.lastname) {
      this.noticeService.setNotice('请填写取票信息！');
      return;
    }
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(this.phone)) {
      this.noticeService.setNotice('请填写纯数字电话号码！');
      return;
    }
    if (this.phone.toString().length < 10 || this.phone.toString().length > 11) {
      this.noticeService.setNotice('请填写正确电话号码！');
      return;
    }
    if (this.phone.toString().length === 10 && this.phone.toString().indexOf('04') !== 0) {
      this.noticeService.setNotice('请填写正确电话号码！');
      return;
    }
    if (this.phone.toString().length === 11 && this.phone.toString().indexOf('1') !== 0) {
      this.noticeService.setNotice('请填写正确电话号码！');
      return;
    }
    // if(this.phone.toString().indexOf('123456') || this.phone.toString().indexOf('111111')){
    //   this.noticeService.setNotice('请填写正确电话号码！');
    //   return;
    // }
    if (this.email.indexOf('@') < 0 || this.email.indexOf('.') < 0) {
      this.noticeService.setNotice('请填写正确Email！');
      return;
    }

    this.noticeService.setNotice();

    let giftCardUsed: boolean;
    if (this.usedGiftcard.length) {
      giftCardUsed = true;
    } else {
      giftCardUsed = false;
    }

    let orderNeedDelivery: boolean;
    let orderPickupPointCode: string;
    let orderDeliveryOptionCode: string;
    switch (this.shippingOption) {
      case 'pickUp':
        orderNeedDelivery = false;
        orderPickupPointCode = this.chosePickUp.pointCode;
        orderDeliveryOptionCode = null;
        break;
      case 'delivery':
        orderNeedDelivery = true;
        orderPickupPointCode = null;
        orderDeliveryOptionCode = this.choseDelivery.deliveryOptionCode;
        break;
    }
    const data = {
      orderPs: this.orderPS,
      giftCardUsed: giftCardUsed,
      orderNeedDelivery: orderNeedDelivery,
      orderPickupPointCode: orderPickupPointCode,
      orderDeliveryOptionCode: orderDeliveryOptionCode,
      couponCode: this.usedCouponCode,
      orderFirstName: this.firstname,
      orderLastName: this.lastname,
      orderEmail: this.email,
      orderPhone: this.phone,
      orderAddress: this.address,
      orderSuburb: this.suburb,
      orderState: this.state,
      orderCountry: 'Australia',
      orderZipCode: this.zipcode,
      orderTickets: this.items,
      orderGiftCards: this.usedGiftcard,
      orderAmount: this.payPrice,
      orderUserCode: this.cookieService.get('userCode'),
      orderUserType: 2,
      orderSourceKey: Setting.SOURCE_PC.key,
      orderSource: Setting.SOURCE_PC.value
    };
    this.orderData.createOrder(data)
      .subscribe(response => this.handleCreateOrder(response),
        err => this.responseService.handleError(err));

  }

  handleGetCoupon(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.coupon = response.data;

        if (this.coupon.couponUsed) {
          this.noticeService.setNotice(Lang.CN.ExpiredCoupon);
          return;
        }
        this.usedCouponCode = this.coupon.discountCode;

        // calculate coupon amount
        this.refreshPayPrice();
        this.noticeService.setNotice('优惠券添加成功！');
        break;
      case 8100:
      case 8440:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  private calculateCouponUseAmount(): void {
    const eligibleTypes = this.coupon.couponApplicableTickets;
    this.couponUseAmount = 0;
    if (eligibleTypes && eligibleTypes.length > 0) {
      // limited coupon
      this.items.forEach(itemType => {
        const eligibleType = eligibleTypes.find(t => t.typeId === itemType.relTicketType);
        if (eligibleType) {
          this.couponUseAmount += itemType.relTicketTypeSubtotal * this.coupon.couponDiscountPercentage / 100;
        }
      });
    } else {
      // general coupon
      this.couponUseAmount = (this.cartTotalPrice + this.deliveryPrice) * this.coupon.couponDiscountPercentage / 100;
    }
    this.couponUseAmount = Number(this.couponUseAmount.toFixed(2));
  }

  handleGetGiftcard(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.giftcard = response.data;
        if (!this.giftcard.giftCardRemainAmount) {
          this.noticeService.setNotice('该礼品卡余额已用尽！');
          return;
        }

        if (this.giftcard.giftCardRemainAmount >= this.payPrice) {
          this.giftcard.giftCardUseAmount = this.payPrice;
        } else {
          this.giftcard.giftCardUseAmount = this.giftcard.giftCardRemainAmount;
        }

        this.payPrice -= this.giftcard.giftCardUseAmount;
        this.payPrice = Number(this.payPrice.toFixed(2));

        this.usedGiftcard.push(this.giftcard);

        this.giftcardCode = '';
        this.noticeService.setNotice('礼品卡添加成功！');
        break;
      case 8000:
      case 8404:
      case 8002:
      case 8003:
      case 8004:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  handleCreateOrder(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.cartData.deleteCart(this.cookieService.get('cartCode'))
          .subscribe(response => {
            },
            err => {
            });

        if (response.data.orderAmount) {
          this.cookieService.put('orderCode', response.data.orderCode);
          this.noticeService.setNotice('下单成功！请尽快完成订单支付!', [{
            class: 'u-button u-button-red u-button-alert',
            id: 'notice-link-checkout',
            string: Lang.CN.Goto
          }]);
          setTimeout(() => {
            this.noticeService.button('notice-link-checkout')
              .subscribe(() => {
                this.router.navigate([Setting.ROUTE_ORDER + '/' + response.data.orderCode + Setting.ROUTE_PAYMENT]);
                this.noticeService.hideNotice();
              });
          }, 0);
        } else {
          this.noticeService.setNotice('支付成功！请查阅邮件查询您的订单信息！', [{
            id: 'notice-link-default'
          }]);
        }
        break;
      case 7017:
        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < this.cart.cartItems.length; j++) {
            if (this.cart.cartItems[j].itemRef === response.data[i].typeId) {
              this.cart.cartItems[j].typeStock = response.data[i].typeStock;
              this.outOfStockItems.push(this.cart.cartItems[j]);
            }
          }
        }
        this.outOfStock = true;
        this.noticeService.hideNotice();
        break;
      case 7002:
      case 7003:
      case 7004:
      case 7005:
      case 7006:
      case 7007:
      case 7008:
      case 7009:
      case 7011:
      case 7018:
      case 7019:
      case 7020:
      case 8002:
      default:
        this.responseService.handleResponse(response);
        console.error(response);
        break;
    }
  }

  // Functions
  // pickUps is all locations that are providing
  selectPickUpState(): void {
    // alert(this.pickUps);
    // alert(this.allPickUps);
    this.pickUps = this.allPickUps.filter(p => p.pointState === this.pickUpState) || [];
    this.chosePickUp = this.pickUps && this.pickUps.length > 0 ? this.pickUps[0] : null;


  }


}
