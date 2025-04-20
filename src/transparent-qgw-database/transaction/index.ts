import { DirectAPI, TransparentDbEngine } from "..";
import { Options } from "./options";
import { Payer } from "./payer";
import {
  CreditCard,
  CvvType,
  ElectronicFundsTransfer,
  Payment,
} from "./payment";
import { RecurringOptions } from "./recurringOptions";

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
    const chunks = [
      this.payment.fields,
      this.payer.fields,
      this.options?.fields,
      this.recurringOptions?.fields,
    ];
    return Object.assign({}, ...chunks);
  }
}

// TODO: Split up the large DirectAPI type into manageable chunks where each chunk is a class containing fields related to each other.
// These classes are what the TransactionRequest constructor will take.

export class TransactionResponse {}
