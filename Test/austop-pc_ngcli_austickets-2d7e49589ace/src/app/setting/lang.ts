export class Lang {
  static CN: any = {
    // Common
    'Confirm': '确认',
    'Goto': '前往',
    'Refresh': '刷新',
    'SystemError': '系统错误！请稍后尝试！',
    // Alert Message
    // Cart Related
    'ChooseTicketType': '请选择票型！',
    'OutOfStock': '库存不足！',
    'WrongInput': '输入错误！',
    'AddCart': '已添加至购物车，您可继续浏览本站！',
    'CheckOut': '已添加至购物车，即将前往购物车结账！',
    'DeleteSucceed': '删除成功！',
    'UpdateSucceed': '更新成功！',

    // Order Related
    'ExpiredCoupon': '该优惠券已失效！',
    'WrongCoupon': '优惠券不存在！',

    // Payment Related
    'PaymentStripeCardNumberPlaceholder': '信用卡卡号',
    'PaymentStripeCardCvcPlaceholder': '信用卡验证码(位于信用卡背面)',

    'PaymentSuccess': '支付成功！请前往邮箱查收订单确认信！',
    'PaymentCardFail': '支付失败！如有疑问请联系管理员：admin@austickets.com.au',
    'PaymentCardHolderError': '请输入持卡人姓名！',
    'PaymentCardInputError': '请检查您的信用卡信息！',

    'NetworkError': '网络异常！',
    'UnknownError': '异常情况，请刷新页面！'
  };

  static APP_DEFAULT_LANG_TAG = 'CN';
  static APP_DEFAULT_LANG: any = Lang[Lang.APP_DEFAULT_LANG_TAG];
}
