import {environment} from '../../environments/environment';

export class Setting {
    static VERSION = `1.2.10${environment.production ? '' : '-preview'}`;

    static HOST = environment.production ? 'austickets.com.au' : 'staging.austickets.com.au';

    static API_BASE = environment.production ? 'https://api.austickets.com.au' : 'https://staging.austickets.com.au/api';

    static API_CART = '/carts';
    static API_CATEGORY = '/categories';
    static API_SLIDER = '/sliders';
    static API_TICKET = '/tickets';
    static API_COUPON = '/coupons';
    static API_GIFTCARD = '/giftcards';
    static API_USER = '/users';
    static API_ORDER = '/ticketorders';
    static API_PICKUP = '/pickuppoints';
    static API_DELIVERY = '/deliveryoptions';
    static API_PAYMENT = '/payments';
    static API_PAYMENT_METHOD = '/paymentmethods';
    static API_EVENT = '/events';

    static ROUTE_CART = '/carts';
    static ROUTE_TICKET = '/tickets';
    static ROUTE_ORDER = '/orders';
    static ROUTE_PAYMENT = '/payments';
    static ROUTE_ABOUT = '/about';
    static ROUTE_USER = '/users';
    static ROUTE_EVENT = '/events';

    static EXPIRE_LOG_OFF_CART: number = 30 * 24 * 3600 * 1000; // 30天

    static K_TEMPORARY_INFO_READ = 'K_TEMPORARY_INFO_READ';

    static COOKIE_K_PAYMENT_CODE = 'cookie_k_payment_code';
    static COOKIE_K_PAYMENT_METHOD = 'cookie_k_payment_method';

    static CLIENT_TYPE = {
        PC: 'PC',
        MOBILE: 'MOBILE',
        APP: 'APP'
    };

    static SOURCE_PC = {key: 'PC_WEB', value: 'www.austickets.com.au'};

    static INFO_PRIVACY = `<p><h4>介绍</h4><p>
    <p>AusTickets非常重视客户的隐私。以下隐私政策适用于所有AusTickets用户，并符合互联网隐私标准。如您对此有任何疑问或担忧，请通过邮件admin@austickets.com.au联系。</p>
    <p>&nbsp;</p>  
    <p><h4>信息收集</h4></p>
    <p>为了正常使用本网站，AusTickets可能需要您的个人信息以便提供最好的服务。所有的通信内容都将被收集并储存，特别是订单信息，账号信息与向您发送的电子邮件。</p>
    <p>&nbsp;</p> 
    <p>*AusTickets对于隐私政策拥有最终解释权</p>`;

    static INFO_REFUND = `<p><h4>购物流程</h4><p>
    <p>网上下单后，您将立刻通过电子邮件收到订单信息。在您支付后，根据您的支付方式，AusTickets会立刻自动确认或在1-4个工作日内人工确认您的订单。若订单确认时，您预定的票务尚有库存且满足您的数量需求，AusTickets会向您的电子邮箱发送订单确认信；若订单确认时，您预订的票务已售馨或库存不足，AusTickets将联系您进行订单撤销与返款事宜; 若订单确认后，因第三方原因无法出票，AusTickets将会联系您进行协商，并进行订单撤销与退款事宜。</p>
    <p>&nbsp;</p>  
    <p><h4>实物送货政策</h4><p>
    <p>当您收到订单确认信后，AusTickets将在2-4周之内通知您前往线下取票点取票或者通过澳大利亚邮政为您寄出（根据您的下单时选择的取票方式决定）。</p>
    <p>&nbsp;</p> 
    <p><h4>电子送货政策</h4></p>
    <p>当您收到订单确认信后，AusTickets将在2-4周之内把您的电子票/接入码/等发送到您的电子邮箱。</p>
    <p>&nbsp;</p> 
    <p><h4>退款与退货政策</h4></p>
    <p>1）只有当不可抗力因素发生，如主办方取消活动、重新安排时间、地点改变（并且您不能或不愿意参加重新安排后的时间，地点）、或者澳大利亚消费法上有额外的指出内容，AusTickets才会提供退货或退款。您必须在10个工作日内才能申请退款。AusTickets不会因为您个人意愿的变更而提供退换货服务。</p>
    <p>2）若主办取消活动，重新安排时间或变更场地，所有的责任仅限于该票购买的金额（包括任何手续费用或收费）。若要退换货，需要提供相关的购买凭证。除非法律（澳大利亚消费法）条款指出，不然AusTickets或主办方都没有责任为您因演出活动取消、时间变更或场地变更所造成的损失负责，包括任何交通及住宿所产生的费用。</p>
    <p>3）如果可以提供相关的凭证，并在演出活动前一定日期内通知，AusTickets可以提供门票丢失，被盗，破坏或毁坏的补票服务。若使用此服务，AusTickets会收取一笔合理的费用。AusTickets不会为没有座位的票（general admission票）提供补票服务。部分演唱会可能由于主办方原因不支持补票服务。相应的，AusTickets也不会为这部分演出提供补票服务。</p>
    <p>&nbsp;</p> 
    <p>*AusTickets对于送退货政策拥有最终解释权</p>`;

    static INFO_TEMPORARY_MESSAGE = `
  <h4>燥是态度，燃放激情！520"轰炸"悉尼</h4>
  <p>由 环澳传媒 与 世禹集团 联合打造的《Hot Blooded Streetdance Australia 热血澳洲》要来啦！除了能看到澳洲8-12支最顶级的街舞团表演赛，更请来了爱奇艺最火热节目《热血街舞团》中一炮而红的“battle不败神话”肖杰！他会作为本次大赛专业评委以及表演嘉宾！还有国内一线RAPPER组合DoubleX2的强势助力，现场立马给你一段free style！</p>
  `;

    static INFO_CREDIT_CARD_METHOD = `
  <div style="text-align: left;">
  <p>因现在信用卡盗刷情况猖獗，本网站特此添加以下信用卡支付使用条款：</p>
  <p>1. 信用卡支付只支持提前来AusTop本部取票</p>
  <p>2. 信用卡支付将收取1.75%+$0.3的手续费</p>
  <p>3. 信用卡支付在取票时需本人携带个人有效ID和购票信用卡前来领取</p>
  <p>4. 信用卡支付在购票后，我们将进行人工短信确认，使用他人信用卡支付者，我们将要求提供持卡人有效ID照片。</p>
  <p>5. 盗刷信用卡在澳洲属于违法犯罪行为，如果发现，AusTickets将配合警方行动并提供相关信息。</p>
  </div>
  `;

    static ORDER_STATUS(id: number): string {
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

    static ID_BANK_TRANSFER = 2016;
    static ID_PAYPAL = 2017;
    static ID_ALIPAY = 2018;
    static ID_UNIONPAY = 2019;
    static ID_WECHATPAY = 2021;
    static ID_CREDIT_CARD = 2022;

    static PAYMENT_METHOD(id: number): string {
        switch (id) {
            case this.ID_BANK_TRANSFER:
                return '银行转账 Bank Transfer';
            case this.ID_PAYPAL:
                return '贝宝 PayPal';
            case this.ID_ALIPAY:
                return '支付宝 Alipay';
            case this.ID_UNIONPAY:
                return '银联在线支付 UnionPay Online Payment';
            case this.ID_WECHATPAY:
                return '微信支付 WeChatPay';
            case this.ID_CREDIT_CARD:
                return '信用卡支付 Credit Card';
            default:
                return '';
        }
    }

}
