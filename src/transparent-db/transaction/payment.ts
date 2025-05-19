import { Expose, Type, instanceToPlain } from "class-transformer";
import { DirectAPI } from "../api";
import { plainToNonArrayInstance } from "../../utils/serialization";
import { TwoStateMappable } from "../../utils/mapping";

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

type PaymentMethodDirectApiFields = {
  CreditCard: CreditCardDirectApiFields;
  ElectronicFundsTransfer: ElectronicFundsTransferDirectApiFields;
};

/**
 * ### Description
 *  TransactionRequest needs to be able to take in a payment amount and method.
 *
 * @privateRemarks
 * Payment Class to DirectAPI mapping:
 *  - amount: amount
 *  - method: CreditCard | ElectronicFundsTransfer
 *
 * Payment is a special case because it's method can be one of two states / classes based on its  method field:
 * 1. CreditCard
 * 2. ElectronicFundsTransfer
 *
 * So when we map Payment's fields to DirectAPI fields, depending on which kind of payment method the instance of Payment is,
 * We will map different sets of fields to their corresponding set of DirectAPI fields.
 *
 * ex:
 * CreditCard payment fields:
 * - number
 *
 * EFT payment fields:
 * - abaNumber
 *
 * DirectAPI fields:
 * - cc
 * - aba
 *
 * if our Payment instance is CreditCard,
 * we must map its "number" field => "cc" DirectAPI field
 * otherwise if the instance is EFT,
 * we must map its "abaNumber" => "aba" DirectAPI field
 */
export class Payment
  implements
    TwoStateMappable<
      DirectAPI,
      CreditCard,
      ElectronicFundsTransfer,
      CreditCardDirectApiFields,
      ElectronicFundsTransferDirectApiFields
    >
{
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
  }

  getState(): CreditCard | ElectronicFundsTransfer {
    if (this.method?.kind == "CC") {
      return this.method as CreditCard;
    }
    if (this.method?.kind == "EFT") {
      return this.method as ElectronicFundsTransfer;
    }
    throw new Error("This Payment Method State does not exist");
  }

  toPartial():
    | Pick<DirectAPI, CreditCardDirectApiFields>
    | Pick<DirectAPI, ElectronicFundsTransferDirectApiFields> {
    switch (this.method.kind) {
      case "CC":
        return {
          amount: this.amount.toString(),
          trans_method: this.method.kind,
          ccnum: this.method.number,
          ccmo: this.method.expirationMonth,
          ccyr: this.method.expirationYear,
          CVV2: this.method.cvv2,
          CVVtype: this.method.cvvType,
        };
      case "EFT":
        return {
          amount: this.amount.toString(),
          trans_method: this.method.kind,
          aba: this.method.aba,
          checkacct: this.method.checkingAccountNumber,
        };
      default:
        throw new Error("Unsupported Payment type");
    }
  }

  isStateA(): this is { getState(): CreditCard } {
    return this.method instanceof CreditCard;
  }
  isStateB(): this is { getState(): ElectronicFundsTransfer } {
    return this.method instanceof ElectronicFundsTransfer;
  }

  isCreditCard(): this is { getState(): CreditCard } {
    return this.isStateA();
  }

  isElectronicFundsTransfer(): this is { getState(): ElectronicFundsTransfer } {
    return this.isStateB();
  }

  static fromJSON(json: any): Payment {
    return plainToNonArrayInstance(Payment, json);
  }

  toJSON(): any {
    return instanceToPlain(this);
  }
}

export type CreditCardDirectApiFields =
  | "amount"
  | "trans_method"
  | "ccnum"
  | "ccmo"
  | "ccyr"
  | "CVV2"
  | "CVVtype";

export type ElectronicFundsTransferDirectApiFields =
  | "amount"
  | "trans_method"
  | "aba"
  | "checkacct";
