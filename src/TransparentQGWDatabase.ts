import { TransactionRequest, TransactionResponse } from "./Transaction";

export class Engine {
  public gatewayLogin: string;
  static postURL: string = "https://secure.quantumgateway.com/cgi/tqgwdbe.php";

  constructor(gatewayLogin: string) {
    this.gatewayLogin = gatewayLogin;
  }

  send(transactionRequest: TransactionRequest): TransactionResponse {
    // TODO
    return TransactionResponse;
  }

  validate(transactionRequest: TransactionRequest): boolean {
    // TODO
    return true;
  }

  convertToPayload(transaction: TransactionRequest): API {
    // TODO
    return {
      gwlogin: "",
      amount: "",
      BADDR1: "",
      BZIP1: "",
      BCUST_EMAIL: "",
      override_email_customer: "Y",
      override_trans_email: "Y",
    };
  }
}

/*
Description:
    This API type is based on Quantum Gateway's Transparent Database Engine API Document Here:
    https://www.quantumgateway.com/files/QGW-Non-Interactive_API.pdf
    Since the doc has no version, we will version this document and its content: v1.0

Version: v1.0

API Document Link:
    - https://www.quantumgateway.com/files/QGW-Non-Interactive_API.pdf
    - under the root ./documents/v1.0/QGW-Non-Interactive_API.pdf


NOTES
----
Type Safety and Checking Guarantees:
    - Besides the type safety, no other checks are in place for the values like run time guarantees.
    - This API acts as a simple interface that's effectively a

This API type follows the API Document exactly based on these criteria:
    Variables:
        - name + casing
        - ordering exactly like the way the Document orders it.
        - ex:
            - Ordering for Document API:     gwlogin, trans_method, transID...
            - Ordering for Library API type: gwlogin, trans_method, transID...
        - variable being required or optional.
        - Required variables in the document have (Required) in red.
        - Exception: the only variable NOT included in this type is: the Document Item Post URL https://secure.quantumgateway.com/cgi/tqgwdbe.php (Required)
        - This Library does it this way because the Engine class in this module is responsible for holding the Post URL and sending it to that endpoint along with the Document's API variables and values.

    Values:
        - all type string
        - why all strings?
            - Their engine consumes data with Content-Type: application/x-www-form-urlencoded
            - this content type converts everything to a string so it makes sense that every single value is ot type string.
        - Exceptions:
        - TransactionType is an Enum buts its values are essentially strings according to the API.
        - String default values:
            - some values are still type string but are restricted to specific types according to Quantum Gateway's interface.
            - ex: trans_method is only a "CC" or "EFT", override_email_customer is only "Y" or "N", override_recur is only "1" or "2", etc.
*/
export type API = {
  gwlogin: string;
  trans_method?: "CC" | "EFT"; // "CC" or "EFT" depending on if class Transaction has CreditCard | ElectronicFundsTransfer type as its payment field.
  trans_type?: TransactionType; // TransactionOptions.transctionType where transactioType is a TransactionType enum
  transID?: string; // TransactionOptions.transactionID
  ccnum?: string; // CreditCard.number
  ccmo?: string; // CreditCard.expirationMonth
  ccyr?: string; // CreditCard.expirationYear
  aba?: string; // ElectronicFundsTransfer.aba
  checkacct?: string; // ElectronicFundsTransfer.checkingAccountNumber
  amount: string; // Transaction.amount
  BADDR1: string; // BillingInfo.address
  BZIP1: string; // BillingInfo.zip
  BCUST_EMAIL: string; // BillingInfo.email
  override_email_customer: "Y" | "N"; // TransactionOptions.emailCustomerReceipt
  override_trans_email: "Y" | "N"; // TransactionOptions.sendTransactionEmail
  RestrictKey?: string; // TransactionOptions.restrictKey
  BNAME?: string; // BillingInfo.name
  CVV2?: string; // CreditCard.cvv2
  CVVtype?: string; // CreditCard.cvvType
  Dsep?: string; // TransactionOptions.dataSeparator
  MAXMIND?: "1" | "2"; // TransactionOptions.maxMindOn
  override_recur?: "Y" | "N"; // RecurringOptions.overrideRecurringPrice
  RID?: string; // RecurringOptions.rid
  initial_amount?: string; // RecurringOptions.initialAmount
  recur_times?: string; // RecurringOptions.recurCycles
  OverRideRecureDay?: "Y" | "N"; // RecurringOptions.overrideRecurringDay
};

enum TransactionType {
  "CREDIT" = "CREDIT",
  "SALES" = "SALES",
  "AUTH_CAPTURE" = "AUTH_CAPTURE",
  "AUTH_ONLY" = "AUTH_ONLY",
  "RETURN" = "RETURN",
  "VOID" = "VOID",
  "PREVIOUS_SALE" = "PREVIOUS_SALE",
}
