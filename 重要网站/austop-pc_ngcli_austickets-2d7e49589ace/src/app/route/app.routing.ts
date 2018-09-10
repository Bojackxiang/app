import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AboutComponent} from '../page/about/about.component';
import {CartComponent} from '../page/cart/cart.component';
import {EventComponent} from '../page/event/event.component';
import {EventListComponent} from '../page/event-list/event-list.component';
import {EventListCategoryComponent} from '../page/event-list-category/event-list-category.component';
import {IndexComponent} from '../page/index/index.component';
import {OrderComponent} from '../page/order/order.component';
import {OrderCreateComponent} from '../page/order-create/order-create.component';
import {OrderListComponent} from '../page/order-list/order-list.component';
import {PaymentComponent} from '../page/payment/payment.component';
import {PaymentAlipayQrcodeComponent} from '../page/payment-alipay-qrcode/payment-alipay-qrcode.component';
import {PaymentDirectDebitComponent} from '../page/payment-direct-debit/payment-direct-debit.component';
import {PaymentPaypalComponent} from '../page/payment-paypal/payment-paypal.component';
import {PaymentWechatComponent} from '../page/payment-wechat/payment-wechat.component';
import {PaymentStripeComponent} from '../page/payment-stripe/payment-stripe.component';
import {PaymentUnionpayComponent} from '../page/payment-unionpay/payment-unionpay.component';
import {PickupListComponent} from '../page/pickup-list/pickup-list.component';
import {TicketComponent} from '../page/ticket/ticket.component';
import {TicketListComponent} from '../page/ticket-list/ticket-list.component';
import {TicketListCategoryComponent} from '../page/ticket-list-category/ticket-list-category.component';
import {UserEmailComponent} from '../page/user-email/user-email.component';
import {UserInformationComponent} from '../page/user-information/user-information.component';
import {UserPasswordComponent} from '../page/user-password/user-password.component';
import {UserUnsubscriptionComponent} from '../page/user-unsubscription/user-unsubscription.component';

const appRoutes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'events',
    component: EventListComponent
  },
  {
    path: 'events/category/:category',
    component: EventListCategoryComponent
  },
  {
    path: 'events/:eventCode',
    component: EventComponent
  },
  {
    path: 'tickets',
    component: TicketListComponent
  },
  {
    path: 'tickets/category/:category',
    component: TicketListCategoryComponent
  },
  {
    path: 'tickets/:ticketCode',
    component: TicketComponent
  },
  {
    path: 'carts',
    component: CartComponent
  },
  {
    path: 'orders',
    component: OrderListComponent
  },
  {
    path: 'orders/create',
    component: OrderCreateComponent
  },
  {
    path: 'orders/:orderCode',
    component: OrderComponent
  },
  {
    path: 'orders/:orderCode/payments',
    component: PaymentComponent
  },
  {
    path: 'orders/:orderCode/payments/directDebit',
    component: PaymentDirectDebitComponent
  },
  {
    path: 'orders/:orderCode/payments/alipayQrcode',
    component: PaymentAlipayQrcodeComponent
  },
  {
    path: 'orders/:orderCode/payments/wechat',
    component: PaymentWechatComponent
  },
  {
    path: 'orders/:orderCode/payments/paypal',
    component: PaymentPaypalComponent
  },
  {
    path: 'orders/:orderCode/payments/card',
    component: PaymentStripeComponent
  },
  {
    path: 'orders/:orderCode/payments/unionpay',
    component: PaymentUnionpayComponent
  },
  {
    path: 'pickups',
    component: PickupListComponent
  },
  {
    path: 'users/information',
    component: UserInformationComponent
  },
  {
    path: 'users/password',
    component: UserPasswordComponent
  },
  {
    path: 'users/email',
    component: UserEmailComponent
  },
  {
    path: 'users/unsubscription/:userCode',
    component: UserUnsubscriptionComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
