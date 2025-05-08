import { DirectAPI } from "../api";
import { Options } from "./options";
import { Payer } from "./payer";
import { Payment } from "./payment";
import { RecurringOptions } from "./recurringOptions";

/**
 * ### Description
 *  Wrapper class for the DirectAPI.
 *  This wrapper aims to make life easier for the Developer in a few ways:
 *  - consistent casing for variable names
 *      - compared to the Library API and Document API with inconsistent casing. ex: trans_type, ccnum, RestrictKey
 *  - common sense data types rather than just all strings
 *      - Some values in the Library API are "Y" | "N" or "1" or "2" which are effectively just booleans. This class takes booleans but then converts it to the values expected of the official API.
 *  - Splits up parameters and objects into intuitive types instead of taking one giant type with all of the variables and values like the Library API.
 *  - input and format checking
 *      - ex: if you are going to make your payment type / trans_method = "CC", the class ensures both in compile time and runtime that you have:
 *      - ccnum, ccmo, and ccyr values as well.
 *
 *
 * ### TransactionRequest Class vs DirectAPI
 *  The required fields are going to be a bit different from the DirectAPI
 *  but if something is optional in this class and required in the direct api,
 *  we will make sure that a default value is set.
 *
 *  You trade the directness of the API for the convenience and runtime safeguards of this class.
 *  Just because it's less direct doesn't means it's inaccurate though. Since we're using typescript to implement this class,
 *  strong typing is still there to ensure when the TransactionRequest converts the parameters into the Library API.
 *
 * @remarks
 * - TODO: [NOT YET IMPLEMENTED] input and format checking for TransactionRequest class and other classes that TransactionRequest uses.
 *
 */
export class TransactionRequest {
  /**
   *
   * @param options - Transparent DB transaction settings not related to the transaction's payment, payer, or recurring options.
   */
  constructor(
    public payment: Payment,
    public payer: Payer,
    public options?: Options,
    public recurringOptions?: RecurringOptions
  ) {}

  /** @hidden */
  toAPI(): DirectAPI {
    const chunks = [
      this.payment.directApiFields,
      this.payer.directApiFields,
      this.options?.directApiFields,
      this.recurringOptions?.directApiFields,
    ];
    return Object.assign({}, ...chunks);
  }
}
