import {CartItem} from './cart-item';

export class Cart {
  cartCode: string;
  cartId: number;
  cartItems: CartItem[];
  cartUser: number;
  cartUserCode: string;
  createAt: number;
  version: number;
}

