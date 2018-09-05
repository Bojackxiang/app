import {TicketType} from './ticket-type';

export class Coupon {
  couponDiscountPercentage: number;
  couponUsed: boolean;
  couponUsedByUser: number;
  createAt: number;
  discountCode: string;
  discountExpireAt: number;
  discountId: number;
  discountStartAt: number;
  discountUsedAt: number;
  discountValidTime: number;
  version: number;
  couponApplicableTickets: TicketType[];
}
