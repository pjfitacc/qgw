import { TransactionRequest, TransactionResponse } from "./transaction";

/*
A class that communicates w/ the TransparentQGW Database Engine @ POST URL: https://secure.quantumgateway.com/cgi/tqgwdbe.php
It acts as a middleman between this library and the engine.

Class Flow:
1. It sends a request to Db Engine containing the values it needs using the class's send(transactionRequest) method.
2. Gets back a response from the Engine 
3. Returns a formatted version of that response with the TransactionResponse object.
It's just a fancy way of calling a POST method for Quantum Gateway's Transparent QuantumGateway Database Engine resource.

Naming:
Since this class's functionality is similar to just POSTing to TransQGWDb Engine URL directly w/ cUrl or Postman,
we call it the TransparentDbEngine similar to how Quantum Gateway calls it the Engine.
If it walks like a duck...

The only difference between this class and the Official TransQGWDb Engine is that this class sends a better formatted response compared to POSTing directly.
*/
export class TransparentDbEngine {
  public gatewayLogin: string;
  static postURL: string = "https://secure.quantumgateway.com/cgi/tqgwdbe.php";

  constructor(gatewayLogin: string) {
    this.gatewayLogin = gatewayLogin;
  }

  send(
    transactionRequest: TransactionRequest | DirectAPI
  ): TransactionResponse {
    // TODO
    return TransactionResponse;
  }

  validate(transactionRequest: TransactionRequest): boolean {
    // TODO
    return true;
  }
}

/*
Description:
    This API type is an exact clone of QGW's Transparent Database Engine Official Document API here:
    https://www.quantumgateway.com/files/QGW-Non-Interactive_API.pdf
    Because this API type is virtually the same as the Official API, we call it a "DIRECT" API,
    as if we're using the interface exactly laid out as how QGW intended it.
    Since the doc has no version, we will version this document and its content: v1.0

Version: v1.0

Official Document API Link:
    - https://www.quantumgateway.com/files/QGW-Non-Interactive_API.pdf
    - under the root ./documents/v1.0/QGW-Non-Interactive_API.pdf


NOTES
----
Type Safety and Checking Guarantees:
    - Besides the type safety, no other checks are in place for the values like run time guarantees.

This DirectAPI type follows the Document's API exactly based on these criteria:
    Variables:
        - name + casing
        - ordering exactly like the way the Document orders it.
        - ex:
            - Ordering for Document API:     gwlogin, trans_method, transID...
            - Ordering for DirectAPI type:   gwlogin, trans_method, transID...
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
        - trans_type value is an enum, TransactionType, but the enum's values are essentially strings.
        - String default values:
            - some values are still type string but are restricted to specific types according to Quantum Gateway's interface.
            - ex: trans_method is only a "CC" or "EFT", override_email_customer is only "Y" or "N", override_recur is only "1" or "2", etc.
    
    Required Values According to Documentation:
        1. gwlogin
        2. amount
        3. BADDR1
        4. BZIP1
        5. BCUST_EMAIL
        6. override_email_customer
        7. override_trans_email

    Actual Required Values:
        1. gwlogin
        2. amount
        3. ccnumber IF trans_method CC
      
    Default Values According to Documentation:
      - The Default Values are what Quantum Gateway assumes should be filled if these fields are not provided.
      - Note: In this section, settings = QuantumGateway Login => Processing Settings, unless otherwise stated.
        1. trans_method = "CC"
        2. trans_type = settings => Processing Mode
        3. override_email_customer = settings => Email Receipts => Send Email Receipts To Customers: Yes or No
        4. override_trans_email = settings => Email Receipts => Receive Merchant Receipts: Yes or No
        5. RestrictKey = key if use Restrict Key is enabled @ settings => RestrictKey
        6. Dsep = settings => Default Data Separator
        7. MAXMIND = "1" Use Maxmind (default if not sent).
*/
export type DirectAPI = {
  gwlogin: string;
  trans_method?: "CC" | "EFT"; // "CC" or "EFT" depending on if class Payment has CreditCard or ElectronicFundsTransfer type as its payment field.
  trans_type?: TransactionType; // Options.transctionType where transactioType is a TransactionType enum
  transID?: string; // Options.transactionID
  ccnum?: string; // CreditCard.number
  ccmo?: string; // CreditCard.expirationMonth
  ccyr?: string; // CreditCard.expirationYear
  aba?: string; // ElectronicFundsTransfer.aba
  checkacct?: string; // ElectronicFundsTransfer.checkingAccountNumber
  amount: string; // Payment.amount
  BADDR1: string; // Payer.address
  BZIP1: string; // Payer.zip
  BCUST_EMAIL: string; // Payer.email
  override_email_customer: "Y" | "N"; // Options.emailCustomerReceipt
  override_trans_email: "Y" | "N"; // Options.sendTransactionEmail
  RestrictKey?: string; // Options.restrictKey
  BNAME?: string; // Payer.name
  CVV2?: string; // CreditCard.cvv2
  CVVtype?: "0" | "1" | "2" | "9"; // CreditCard.cvvType
  Dsep?: string; // Options.dataSeparator
  MAXMIND?: "1" | "2"; // Options.maxMindOn
  override_recur?: "Y" | "N"; // RecurringOptions.overrideRecurringPrice
  RID?: string; // RecurringOptions.rid
  initial_amount?: string; // RecurringOptions.initialAmount
  recur_times?: string; // RecurringOptions.recurCycles
  OverRideRecureDay?: "Y" | "N"; // RecurringOptions.overrideRecurringDay
};

export enum TransactionType {
  "CREDIT" = "CREDIT",
  "SALES" = "SALES",
  "AUTH_CAPTURE" = "AUTH_CAPTURE",
  "AUTH_ONLY" = "AUTH_ONLY",
  "RETURN" = "RETURN",
  "VOID" = "VOID",
  "PREVIOUS_SALE" = "PREVIOUS_SALE",
}
