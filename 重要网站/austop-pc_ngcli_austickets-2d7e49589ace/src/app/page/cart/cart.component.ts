import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NoticeService} from '../../service/notice.service';
import {ResponseService} from '../../service/response.service';
import {CookieService} from 'ngx-cookie';

import {CartData} from '../../data/cart.data';

import {RestResponse} from '../../object/rest-response';
import {Cart} from '../../object/cart';
import {CartItem} from '../../object/cart-item';

import {Lang} from '../../setting/lang';
import {Setting} from '../../setting/setting';

@Component({
  selector: 'cart',
  styleUrls: ['./cart.component.css'],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  setting = Setting;
  waitCart = false;
  cart: Cart;
  hasCartItem = false;
  cartTotalPrice: number;
  currentCartItem: CartItem;
  differenceQuantity: number;
  newQuantity: number;

  constructor(private router: Router,
              private cookieService: CookieService,
              private noticeService: NoticeService,
              private responseService: ResponseService,
              private cartData: CartData) {
  }

  ngOnInit(): void {
    if (this.cookieService.get('cartCode')) {
      this.cartData.getCart(this.cookieService.get('cartCode'))
        .subscribe(response => this.handleGetCart(response),
          err => this.responseService.handleError(err));
    } else {
      this.waitCart = true;
    }
  }

  handleGetCart(response: RestResponse): void {
    this.waitCart = true;
    switch (response.code) {
      case 2000:
        this.cart = response.data;
        this.renderCart();
        break;
      case 7640:
        this.cookieService.remove('cartCode');
        break;
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  renderCart(): void {
    this.cartTotalPrice = 0;
    if (this.cart.cartItems.length) {
      this.hasCartItem = true;
    }
    for (let i = 0; i < this.cart.cartItems.length; i++) {
      this.cartTotalPrice += this.cart.cartItems[i].itemTotalPrice;
    }
    this.cartTotalPrice = Number(this.cartTotalPrice.toFixed(2));
  }

  deleteCartItem(cartItem: CartItem): void {
    this.currentCartItem = cartItem;
    const data = {
      'itemCartCode': this.cookieService.get('cartCode'),
      'itemId': this.currentCartItem.itemId
    };
    this.cartData.deleteCartItem(data)
      .subscribe(response => this.handleDeleteCartItem(response),
        err => this.responseService.handleError(err));
  }

  updateCartItem(event: any, cartItem: CartItem): void {
    const newQuantity: number = Number(event.target.value);

    if (newQuantity && Number.isInteger(newQuantity) && newQuantity > 0) {
      this.differenceQuantity = newQuantity - cartItem.itemQuantity;
      this.currentCartItem = cartItem;
      const data = {
        'itemRef': cartItem.itemRef,
        'itemQuantity': this.differenceQuantity,
        'itemTicketCode': cartItem.itemTicketCode,
        'itemCartCode': this.cookieService.get('cartCode'),
        'itemCartUserCode': this.cookieService.get('userCode')
      };
      this.cartData.updateCartItem(data)
        .subscribe(response => this.handleUpdateCartItem(response, event),
          err => this.responseService.handleError(err));
    } else {
      this.noticeService.setNotice(Lang.CN.WrongInput);
      event.target.value = cartItem.itemQuantity;
      return;
    }
  }

  handleDeleteCartItem(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice(Lang.CN.DeleteSucceed);
        for (let i = 0; i < this.cart.cartItems.length; i++) {
          if (this.cart.cartItems[i] === this.currentCartItem) {
            this.cart.cartItems.splice(i, 1);
          }
        }
        this.renderCart();
        break;
      case 6401:
      default:
        this.responseService.handleResponse(response);
        break;
    }
  }

  handleUpdateCartItem(response: RestResponse, event: any): void {
    switch (response.code) {
      case 2000:
        this.noticeService.setNotice(Lang.CN.UpdateSucceed);
        this.currentCartItem.itemQuantity += this.differenceQuantity;
        this.currentCartItem.itemTotalPrice = Number((this.currentCartItem.itemQuantity * this.currentCartItem.itemSinglePrice).toFixed(2));
        this.renderCart();
        break;
      case 6401:
      case 7604:
      case 7605:
      default:
        event.target.value = this.currentCartItem.itemQuantity;
        this.responseService.handleResponse(response);
        break;
    }
  }
}
