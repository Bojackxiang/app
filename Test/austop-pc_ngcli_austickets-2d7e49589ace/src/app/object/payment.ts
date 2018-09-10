export class Payment {
  createAt: number;
  methodCode: string;
  methodDescription: string;
  methodDiscountAmount: number;
  methodDiscountPercentage: number;
  methodId: number;
  methodIsAutomatic: boolean;
  methodIsEnabled: boolean;
  methodLogoUrl: string;
  methodName: string;
  methodSurchargeAmount: number;
  methodSurchargePercentage: number;
  methodExpectedConfirmTime: string;
  version: number;
}
