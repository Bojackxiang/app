import './plugin/rxjs';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {CookieModule} from 'ngx-cookie';

import {routing} from './route/app.routing';

// data
import {CartData} from './data/cart.data';
import {CategoryData} from './data/category.data';
import {CouponData} from './data/coupon.data';
import {EventData} from './data/event.data';
import {GiftcardData} from './data/giftcard.data';
import {OrderData} from './data/order.data';
import {PaymentData} from './data/payment.data';
import {PickupData} from './data/pickup.data';
import {SlideData} from './data/slide.data';
import {TicketData} from './data/ticket.data';
import {UserData} from './data/user.data';
import {SettingData} from './data/setting.data';

// control
import {CommonService} from './service/common.service';
import {ResponseService} from './service/response.service';
import {NoticeService} from './service/notice.service';

// component
import {AppComponent} from './app.component';

// element
import {ContactComponent} from './element/contact/contact.component';
import {EventFeatureComponent} from './element/event-feature/event-feature.component';
import {EventFeatureSideComponent} from './element/event-feature-side/event-feature-side.component';
import {EventListVerticalComponent} from './element/event-list-vertical/event-list-vertical.component';
import {FooterComponent} from './element/footer/footer.component';
import {HeaderComponent} from './element/header/header.component';
import {NoticeComponent} from './element/notice/notice.component';
import {SlideComponent} from './element/slide/slide.component';
import {TicketFeatureComponent} from './element/ticket-feature/ticket-feature.component';
import {TicketFeatureSideComponent} from './element/ticket-feature-side/ticket-feature-side.component';
import {TicketListVerticalComponent} from './element/ticket-list-vertical/ticket-list-vertical.component';
import {UserComponent} from './element/user/user.component';

// page
import {AboutComponent} from './page/about/about.component';
import {CartComponent} from './page/cart/cart.component';
import {EventComponent} from './page/event/event.component';
import {EventListComponent} from './page/event-list/event-list.component';
import {EventListCategoryComponent} from './page/event-list-category/event-list-category.component';
import {IndexComponent} from './page/index/index.component';
import {OrderComponent} from './page/order/order.component';
import {OrderCreateComponent} from './page/order-create/order-create.component';
import {OrderListComponent} from './page/order-list/order-list.component';
import {PaymentComponent} from './page/payment/payment.component';
import {PaymentAlipayQrcodeComponent} from './page/payment-alipay-qrcode/payment-alipay-qrcode.component';
import {PaymentDirectDebitComponent} from './page/payment-direct-debit/payment-direct-debit.component';
import {PaymentPaypalComponent} from './page/payment-paypal/payment-paypal.component';
import {PaymentWechatComponent} from './page/payment-wechat/payment-wechat.component';
import {PaymentStripeComponent} from './page/payment-stripe/payment-stripe.component';
import {PaymentUnionpayComponent} from './page/payment-unionpay/payment-unionpay.component';
import {PickupListComponent} from './page/pickup-list/pickup-list.component';
import {TicketComponent} from './page/ticket/ticket.component';
import {TicketListComponent} from './page/ticket-list/ticket-list.component';
import {TicketListCategoryComponent} from './page/ticket-list-category/ticket-list-category.component';
import {UserEmailComponent} from './page/user-email/user-email.component';
import {UserInformationComponent} from './page/user-information/user-information.component';
import {UserPasswordComponent} from './page/user-password/user-password.component';
import {UserUnsubscriptionComponent} from './page/user-unsubscription/user-unsubscription.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    CookieModule.forRoot()
  ],
  declarations: [
    AppComponent,

    ContactComponent,
    EventFeatureComponent,
    EventFeatureSideComponent,
    EventListVerticalComponent,
    FooterComponent,
    HeaderComponent,
    NoticeComponent,
    SlideComponent,
    TicketFeatureComponent,
    TicketFeatureSideComponent,
    TicketListVerticalComponent,
    UserComponent,
    //
    AboutComponent,
    CartComponent,
    EventComponent,
    EventListComponent,
    EventListCategoryComponent,
    IndexComponent,
    OrderComponent,
    OrderCreateComponent,
    OrderListComponent,
    PaymentComponent,
    PaymentAlipayQrcodeComponent,
    PaymentDirectDebitComponent,
    PaymentPaypalComponent,
    PaymentWechatComponent,
    PaymentStripeComponent,
    PaymentUnionpayComponent,
    PickupListComponent,
    TicketComponent,
    TicketListComponent,
    TicketListCategoryComponent,
    UserEmailComponent,
    UserInformationComponent,
    UserPasswordComponent,
    UserUnsubscriptionComponent
  ],
  providers: [
    CartData,
    CategoryData,
    CouponData,
    EventData,
    GiftcardData,
    OrderData,
    PaymentData,
    PickupData,
    SlideData,
    TicketData,
    UserData,
    SettingData,
    CommonService,
    ResponseService,
    NoticeService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
