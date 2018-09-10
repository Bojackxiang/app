import {Coupon} from './coupon';
import {Giftcard} from './giftcard';
import {TicketType} from './ticket-type';
import {OrderSub} from './order-sub';

export class Order {
  createAt: number;
  coupon: number;
  couponCode: string;
  couponData: Coupon;
  couponUsed: boolean;
  giftCardUsed: boolean;
  orderGiftCards: Giftcard[];
  orderAmount: number;
  orderCode: string;
  orderCountry: string;
  orderAddress: string;
  orderEmail: string;
  orderEmailSalt: string;
  orderExpireAt: number;
  orderFirstName: string;
  orderId: number;
  orderLastName: string;
  orderNeedDelivery: boolean;
  orderPaymentMethodCode: string;
  orderPaymentMethodName: string;
  orderPhone: string;
  orderPs: string;
  orderState: string;
  orderStatus: number;
  orderSuburb: string;
  orderTickets: null
  orderTicketsInfo: TicketType[];
  orderUser: number;
  orderUserCode: string;
  orderUserType: number;
  orderZipCode: string;
  version: number;
  orderPickupPoint: number;
  orderPickupPointCode: string;
  orderPickupPointName: string;
  orderDeliveryOption: number;
  orderDeliveryOptionCode: string;
  orderDeliveryOptionName: string;
  //
  originOrderAmount: number;
  couponAmount: number;
  giftCardAmount: number;
  deliveryFee: number;
  time: string;
  orderSubInfo: OrderSub;

  // order source info
  orderSourceKey = 'PC_WEB';
  orderSource = 'www.austickets.com.au';
}
