export abstract class PaymentOmipay {
    exchangeRate: number;
    omipayOrderId: string;
    orderCode: string;
    paymentAmount: number;
    paymentCode: string;
    qrcodeImgBase64: string;
    version: number;
    createAt: number;
}