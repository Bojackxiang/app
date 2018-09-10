export class PaymentUnionpayPurchase {
  version: string;
  signMethod: string;
  signature: string;
  transType: string;
  merAbbr: string;
  merId: string;
  backEndUrl: string;
  frontEndUrl: string;
  orderTime: string;
  orderNumber: string;
  commodityName: string;
  orderAmount: string;
  orderCurrency: string;
  customerIp: string;
  charset: string;
  merCode: string;
  acqCode: string;
  origQid: string;
  merReserved: string;
  transTimeout: string;
  channelType: string;
  
  // fields to be excluded from generating submission payment form
  actionUrl: string;
  systemReferenceId: string;
}
