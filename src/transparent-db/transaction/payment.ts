import { DirectAPI } from "../api";

/**
 * ### Description
 *  Different options to describe the CVV of a credit card to Quantum Gateway.
 *  This is used in the CreditCard class.
 *
 * @privateRemarks
 * CvvType enum to DirectAPI mapping:
 *  - cvvType: CVVtype "0" | "1" | "2" | "9" === Not Passing CVV2 | CVV2 is being passed | CVV2 on card is unreadable |Card does not have CVV2 imprint
 *
 */
export enum CvvType {
  "Not Passing CVV2" = "0",
  "CVV2 is being passed" = "1",
  "CVV2 on card is unreadable" = "2",
  "Card does not have CVV2 imprint" = "9",
}

/**
 * ### Description
 *  A form of payment that the Payment class can take in. The default and most common type of payment processed by Quantum Gateway.
 *
 * @privateRemarks
 *  Credit Card Class to DirectAPI mapping:
 *   - number: ccnum
 *   - expirationMonth: ccmo
 *   - expirationYear: ccyr
 *   - cvv2: CVV2
 *   - cvvType: CVVtype
 *
 */
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

/**
 * ### Description
 *  A form of payment that the Payment class can take in.
 *
 * @privateRemarks
 * ElectronicFundsTransfer Class to DirectAPI mapping:
 *  - aba: aba
 *  - checkingAccountNumber: checkacct
 *
 */
export class ElectronicFundsTransfer {
  readonly kind = "EFT";
  constructor(public aba: string, public checkingAccountNumber: string) {}
}

/**
 * ### Description
 *  TransactionRequest needs to be able to take in a payment amount and method.
 *
 * @privateRemarks
 * Payment Class to DirectAPI mapping:
 *  - amount: amount
 *  - method: CreditCard | ElectronicFundsTransfer
 *
 */
export class Payment {
  public directApiFields: CreditCardPaymentFields | EftPaymentFields;
  constructor(
    public amount: number,
    public method: CreditCard | ElectronicFundsTransfer
  ) {
    switch (method.kind) {
      case "CC":
        this.directApiFields = {
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
        this.directApiFields = {
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
