import { DirectAPI } from "..";
import { DirectAPIBuilder } from "./builder";

// cvvType: CVVtype "0" | "1" | "2" | "9" === Not Passing CVV2 | CVV2 is being passed | CVV2 on card is unreadable |Card does not have CVV2 imprint
export enum CvvType {
  "Not Passing CVV2" = "0",
  "CVV2 is being passed" = "1",
  "CVV2 on card is unreadable" = "2",
  "Card does not have CVV2 imprint" = "9",
}

// Credit Card Class:
// number: ccnum
// expirationMonth: ccmo
// expirationYear: ccyr
// cvv2: CVV2
// cvvType: CVVtype
export class CreditCard {
  readonly kind = "CC";
  constructor(
    public number: string,
    public expirationMonth: string,
    public expirationYear: string,
    public cvv2?: string,
    public cvvType?: CvvType
  ) {}
}

// ElectronicFundsTransfer Class:
// aba: aba
// checkingAccountNumber: checkacct
export class ElectronicFundsTransfer {
  readonly kind = "EFT";
  constructor(public aba: string, public checkingAccountNumber: string) {}
}

// Payment Class:
// - amount: amount
// - method: CreditCard | ElectronicFundsTransfer
export class Payment {
  public fields: CreditCardPaymentFields | EftPaymentFields;
  constructor(
    public amount: number,
    public method: CreditCard | ElectronicFundsTransfer
  ) {
    switch (method.kind) {
      case "CC":
        this.fields = {
          amount: amount.toString(),
          trans_method: method.kind,
          ccnum: method.number,
          ccmo: method.expirationMonth,
          ccyr: method.expirationYear,
          CVV2: method.cvv2,
          CVVtype: method.cvvType,
        };
        return;
      case "EFT":
        this.fields = {
          amount: amount.toString(),
          trans_method: method.kind,
          aba: method.aba,
          checkacct: method.checkingAccountNumber,
        };
        return;
      default:
        throw Error("unaccepted payment method");
    }
  }
}

export type CreditCardPaymentFields = Pick<
  DirectAPI,
  "amount" | "trans_method" | "ccnum" | "ccmo" | "ccyr" | "CVV2" | "CVVtype"
>;

export type EftPaymentFields = Pick<
  DirectAPI,
  "amount" | "trans_method" | "aba" | "checkacct"
>;
