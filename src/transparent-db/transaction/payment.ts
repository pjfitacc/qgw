import { Expose, Type, instanceToPlain } from "class-transformer";
import { DirectAPI } from "../api";
import { plainToNonArrayInstance } from "../../utils/serialization";

/**
 * ### Description
 *  Different options to describe the CVV of a credit card to Quantum Gateway.
 *  This is used in the {@link CreditCard} class.
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
  @Expose()
  readonly kind = "CC";

  @Expose()
  number!: string;

  @Expose()
  expirationMonth!: string;

  @Expose()
  expirationYear!: string;

  @Expose()
  cvv2?: string;

  @Expose()
  cvvType?: CvvType;

  /**
   *
   * @param number - The transaction's credit card number.
   * @param cvvType - How Quantum Gateway handles the CVV2 field.
   */
  constructor(
    number: string,
    expirationMonth: string,
    expirationYear: string,
    cvv2?: string,
    cvvType?: CvvType
  ) {
    this.number = number;
    this.expirationMonth = expirationMonth;
    this.expirationYear = expirationYear;
    this.cvv2 = cvv2;
    this.cvvType = cvvType;
  }

  static fromJSON(json: any): CreditCard {
    return plainToNonArrayInstance(CreditCard, json);
  }

  toJSON(): any {
    return instanceToPlain(this);
  }
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
  @Expose()
  readonly kind = "EFT";

  @Expose()
  aba!: string;

  @Expose()
  checkingAccountNumber!: string;

  constructor(aba: string, checkingAccountNumber: string) {
    this.aba = aba;
    this.checkingAccountNumber = checkingAccountNumber;
  }

  static fromJSON(json: any): ElectronicFundsTransfer {
    return plainToNonArrayInstance(ElectronicFundsTransfer, json);
  }

  toJSON(): any {
    return instanceToPlain(this);
  }
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
  /** @hidden */
  public directApiFields: CreditCardPaymentFields | EftPaymentFields;

  @Expose()
  amount!: number;

  @Expose()
  @Type(() => Object, {
    discriminator: {
      property: "kind",
      subTypes: [
        { value: CreditCard, name: "CC" },
        { value: ElectronicFundsTransfer, name: "EFT" },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  method!: CreditCard | ElectronicFundsTransfer;

  /**
   *
   * @param amount - The transaction's purchase amount.
   */
  constructor(amount: number, method: CreditCard | ElectronicFundsTransfer) {
    this.amount = amount;
    this.method = method;

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

  static fromJSON(json: any): Payment {
    return plainToNonArrayInstance(Payment, json);
  }

  toJSON(): any {
    return instanceToPlain(this);
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
