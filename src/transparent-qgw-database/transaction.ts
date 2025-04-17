import { DirectAPI, TransactionType, TransparentDbEngine } from ".";

/*
TransactionRequest is a custom class specific to this library.
It's a wrapper around the TransQGWDbEngine Document API in ./documents/v1.0/QGW-Non-Interactive_API.pdf
This class ultimately converts its parameters into the DirectAPI type in ./index.ts:
export type DirectAPI = {
  gwlogin: string;
  trans_method?: "CC" | "EFT"; // "CC" or "EFT" depending on if class Transaction has CreditCard | ElectronicFundsTransfer type as its payment field.
  trans_type?: TransactionType;
  ...
}
DirectAPI type is a closer, almost identical match to the Official Document API.
For the following documentation for TransactionRequest, we'll treat the Official Document API and DirectAPI as if they're the same thing.

What's the point of using this object then. Why not just use the official API?

This wrapper aims to make life easier for the Developer:
- consistent casing for variable names
    - compared to the Library API and Document API with inconsistent casing. ex: trans_type, ccnum, RestrictKey
- more intuitive data types rather than just all strings
    - Some values in the Library API are "Y" | "N" or "1" or "2" which are effectively just booleans. This class takes booleans but then converts it to the values expected of the official API.
- Splits up parameters and objects into more intuitive types instead of taking one giant type with all of the variables and values like the Library API.
- input and format checking
    - ex: if you are going to make your payment type / trans_method = "CC", the class ensures both in compile time and runtime that you have:
    - ccnum, ccmo, and ccyr values as well.

The required fields are going to be a bit different from the DirectAPI
but if something is optional in this class and required in the direct api,
we will make sure that a default value is set.

Both the TransactionRequest class and the API type

You trade the directness of the API for the convenience and runtime safeguards of this class. 
Just because it's less direct doesn't means it's inaccurate though. Since we're using typescript to implement this class,
strong typing is still there to ensure when the TransactionRequest converts the parameters into the Library API.
*/
export class TransactionRequest {
  constructor(
    public payment: Payment,
    public payer: Payer,
    public options?: Options,
    public recurringOptions?: RecurringOptions
  ) {}

  convertToPayload(): DirectAPI {
    const gwlogin: string = TransparentDbEngine.postURL;

    const directAPI = new DirectAPIBuilder()
      .withAmount("12")
      .withGwlogin("g")
      .withBADDR1("g")
      .withBZIP1("1")
      .withBCUST_EMAIL("AF")
      .withOverrideEmailCustomer("Y")
      .withOverrideTransEmail("N")
      .build();

    // TODO
    return directAPI;
  }
}

// TODO: Split up the large DirectAPI type into manageable chunks where each chunk is a class containing fields related to each other.
// These classes are what the TransactionRequest constructor will take.

// cvvType: CVVtype "0" | "1" | "2" | "9" === Not Passing CVV2 | CVV2 is being passed | CVV2 on card is unreadable |Card does not have CVV2 imprint
enum CvvType {
  "Not Passing CVV2" = 0,
  "CVV2 is being passed" = 1,
  "CVV2 on card is unreadable" = 2,
  "Card does not have CVV2 imprint" = 9,
}

// Credit Card Class:
// number: ccnum
// expirationMonth: ccmo
// expirationYear: ccyr
// cvv2: CVV2
// cvvType: CVVtype
class CreditCard {
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
class ElectronicFundsTransfer {
  constructor(public aba: string, public checkingAccountNumber: string) {}
}

// Payment Class:
// - amount: amount
// - method: CreditCard | ElectronicFundsTransfer
class Payment {
  constructor(
    public amount: number,
    public method: CreditCard | ElectronicFundsTransfer
  ) {}
}

// Payer Class:
// - address: BADDR1
// - zip: BZIP1
// - email: BCUST_EMAIL
// - name: BNAME
class Payer {
  constructor(
    public address: string,
    public zip: string,
    public email: string,
    public name?: string
  ) {}
}

// Options:
// emailCustomerReceipt: override_email_customer "Y" | "N";
// sendTransactionEmail: override_trans_email "Y" | "N";
// transctionType: trans_type
// transactionID: transID
// restrictKey: RestrictKey
// dataSeparator: Dsep
// maxMindOn: MAXMIND "1" | "2";
class Options {
  constructor(
    public emailCustomerReceipt: boolean = true,
    public sendTransactionEmail: boolean = true,
    public transctionType: TransactionType,
    public transactionID: string,
    public restrictKey?: string,
    public dataSeparator?: string,
    public maxMindOn?: boolean
  ) {}
}

// RecurringOptions:
// rid: RID
//  - if there are recurring options present, this class must ensure that RID exists.
// overrideRecurringPrice: override_recur "Y" | "N"
// initialAmount: initial_amount
// recurCycles: recur_times
// overrideRecurringDay: OverRideRecureDay "Y" | "N"
class RecurringOptions {
  constructor(
    public rid: string,
    public recurCycles: number = 0,
    public overrideRecurringPrice?: boolean,
    public initialAmount?: number,
    public overrideRecurringDay?: boolean
  ) {}
}

// https://stackoverflow.com/a/54126250
class DirectAPIBuilder implements Partial<DirectAPI> {
  gwlogin?: string;
  trans_method?: "CC" | "EFT";
  trans_type?: TransactionType;
  transID?: string;
  ccnum?: string;
  ccmo?: string;
  ccyr?: string;
  aba?: string;
  checkacct?: string;
  amount?: string;
  BADDR1?: string;
  BZIP1?: string;
  BCUST_EMAIL?: string;
  override_email_customer?: "Y" | "N";
  override_trans_email?: "Y" | "N";
  RestrictKey?: string;
  BNAME?: string;
  CVV2?: string;
  CVVtype?: "0" | "1" | "2" | "9";
  Dsep?: string;
  MAXMIND?: "1" | "2";
  override_recur?: "Y" | "N";
  RID?: string;
  initial_amount?: string;
  recur_times?: string;
  OverRideRecureDay?: "Y" | "N";

  // Required fields
  withGwlogin(value: string): this & Pick<DirectAPI, "gwlogin"> {
    return Object.assign(this, { gwlogin: value });
  }

  withAmount(value: string): this & Pick<DirectAPI, "amount"> {
    return Object.assign(this, { amount: value });
  }

  withBADDR1(value: string): this & Pick<DirectAPI, "BADDR1"> {
    return Object.assign(this, { BADDR1: value });
  }

  withBZIP1(value: string): this & Pick<DirectAPI, "BZIP1"> {
    return Object.assign(this, { BZIP1: value });
  }

  withBCUST_EMAIL(value: string): this & Pick<DirectAPI, "BCUST_EMAIL"> {
    return Object.assign(this, { BCUST_EMAIL: value });
  }

  withOverrideEmailCustomer(
    value: "Y" | "N"
  ): this & Pick<DirectAPI, "override_email_customer"> {
    return Object.assign(this, { override_email_customer: value });
  }

  withOverrideTransEmail(
    value: "Y" | "N"
  ): this & Pick<DirectAPI, "override_trans_email"> {
    return Object.assign(this, { override_trans_email: value });
  }

  // Optional fields
  withTransMethod(
    value: "CC" | "EFT"
  ): this & Required<Pick<DirectAPI, "trans_method">> {
    return Object.assign(this, { trans_method: value });
  }

  withTransType(
    value: TransactionType
  ): this & Required<Pick<DirectAPI, "trans_type">> {
    return Object.assign(this, { trans_type: value });
  }

  withTransID(value: string): this & Required<Pick<DirectAPI, "transID">> {
    return Object.assign(this, { transID: value });
  }

  withCcnum(value: string): this & Required<Pick<DirectAPI, "ccnum">> {
    return Object.assign(this, { ccnum: value });
  }

  withCcmo(value: string): this & Required<Pick<DirectAPI, "ccmo">> {
    return Object.assign(this, { ccmo: value });
  }

  withCcyr(value: string): this & Required<Pick<DirectAPI, "ccyr">> {
    return Object.assign(this, { ccyr: value });
  }

  withAba(value: string): this & Required<Pick<DirectAPI, "aba">> {
    return Object.assign(this, { aba: value });
  }

  withCheckacct(value: string): this & Required<Pick<DirectAPI, "checkacct">> {
    return Object.assign(this, { checkacct: value });
  }

  withRestrictKey(
    value: string
  ): this & Required<Pick<DirectAPI, "RestrictKey">> {
    return Object.assign(this, { RestrictKey: value });
  }

  withBNAME(value: string): this & Required<Pick<DirectAPI, "BNAME">> {
    return Object.assign(this, { BNAME: value });
  }

  withCVV2(value: string): this & Required<Pick<DirectAPI, "CVV2">> {
    return Object.assign(this, { CVV2: value });
  }

  withCVVtype(
    value: "0" | "1" | "2" | "9"
  ): this & Required<Pick<DirectAPI, "CVVtype">> {
    return Object.assign(this, { CVVtype: value });
  }

  withDsep(value: string): this & Required<Pick<DirectAPI, "Dsep">> {
    return Object.assign(this, { Dsep: value });
  }

  withMAXMIND(value: "1" | "2"): this & Required<Pick<DirectAPI, "MAXMIND">> {
    return Object.assign(this, { MAXMIND: value });
  }

  withOverrideRecur(
    value: "Y" | "N"
  ): this & Required<Pick<DirectAPI, "override_recur">> {
    return Object.assign(this, { override_recur: value });
  }

  withRID(value: string): this & Required<Pick<DirectAPI, "RID">> {
    return Object.assign(this, { RID: value });
  }

  withInitialAmount(
    value: string
  ): this & Required<Pick<DirectAPI, "initial_amount">> {
    return Object.assign(this, { initial_amount: value });
  }

  withRecurTimes(
    value: string
  ): this & Required<Pick<DirectAPI, "recur_times">> {
    return Object.assign(this, { recur_times: value });
  }

  withOverRideRecureDay(
    value: "Y" | "N"
  ): this & Required<Pick<DirectAPI, "OverRideRecureDay">> {
    return Object.assign(this, { OverRideRecureDay: value });
  }

  build(this: DirectAPI): DirectAPI {
    return { ...this };
  }
}

export class TransactionResponse {}
