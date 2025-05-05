/**
 * ### Description
 *   DirectAPI clones Quantum Gateway's API for the Transparent Database Engine.
 *   The "Direct" in DirectAPI is because we're porting a "direct" copy of the Transparent API into Typescript.
 *
 *   Quantum Gateway (QGW) Transparent Database Engine API Documentation:
 *   https://www.quantumgateway.com/files/QGW-Non-Interactive_API.pdf
 *
 *   Since QGW does not give their API a version number, we will version it ourselves.
 *
 * ### Transparent Database Engine API Version (Library's Version)
 *   - v1.0
 *
 * ### Terminology
 * - Transparent API - short hand for Quantum Gateway's Transparent Database Engine API
 * - DirectAPI - Transparent API's library clone / implementation
 *
 * ### Transparent API Documentation Copy
 *   - if the Transparent API Documentation url above is unavailable, a copy is available under this project's root directory: `./public/api/official/v1.0 QGW-Non-Interactive_API.pdf`
 *
 * ### DirectAPI vs Transparent API
 *     SIMILARITIES:
 *       DirectAPI follows the Transparent API exactly based on this criteria:
 *
 *       Variables:
 *           - name + casing
 *           - ordering exactly like the way the Document orders it.
 *           - ex:
 *               - Ordering for Document API:     gwlogin, trans_method, transID...
 *               - Ordering for DirectAPI type:   gwlogin, trans_method, transID...
 *           - variable being required or optional.
 *           - Required variables in the document have (Required) in red.
 *           - Exception: the only variable NOT included in this type is: the Document Item Post URL https://secure.quantumgateway.com/cgi/tqgwdbe.php (Required)
 *           - This Library does it this way because the Engine class in this module is responsible for holding the Post URL and sending it to that endpoint along with the Document's API variables and values.
 *
 *       Values:
 *           - all type string
 *           - why all strings?
 *               - Their engine consumes data with Content-Type: application/x-www-form-urlencoded
 *               - this content type converts everything to a string so it makes sense that every single value is ot type string.
 *           - Exceptions:
 *           - trans_type value is an enum, TransactionType, but the enum's values are essentially strings.
 *           - Set string values:
 *               - some values are still type string but are restricted to specific types according to Quantum Gateway's interface.
 *               - ex: trans_method is only a "CC" or "EFT", override_email_customer is only "Y" or "N", override_recur is only "1" or "2", etc.
 *
 *     DIFFERENCES:
 *       Where this Library's DirectAPI becomes opinionated and diverges from the official Document API.
 *
 *       Required + Optional Items:
 *           Required Values According to Transparent API:
 *               1. gwlogin
 *               2. amount
 *               3. BADDR1
 *               4. BZIP1
 *               5. BCUST_EMAIL
 *               6. override_email_customer
 *               7. override_trans_email
 *
 *           Required Values According to DirectAPI:
 *               1. gwlogin
 *               2. amount
 *               3. ccnumber IF trans_method = CC
 *               4. aba,checkacct IF trans_method = EFT
 *               - note: These were decided from testing what the Transparent API ACTUALLY needed based on Postman tests:
 *               - note: Since the trans_method could either be CC or EFT and not both,
 *                 it doesn't make sense to make the required values: ccnumber, aba, checkacct to be labeled as required.
 *                 if we make all of those fields required,
 *                 then if the trans_method is CC,
 *                   we'd still have to fill in data for aba and checkacct
 *                 and if the trans_method is EFT,
 *                   we'd still have to fill in data for ccnumber.
 *                 Making those fields in DirectAPI required would mean the user of this API would have to fill in unnecessary fields.
 *                 The rest of the reuirqed values though like gwlogin and amount are actually required in the DirectAPI type as seen with
 *                 the values not having question marks "?" which indicate an optional value in Typescript.
 *
 *     Default Values:
 *       - The Default Values are what Quantum Gateway assumes should be filled in Transparent API if these fields are not provided in the request.
 *       - Note: In this section, settings = QuantumGateway Login =\> Processing Settings, unless otherwise stated.
 *         1. trans_method = "CC"
 *         2. trans_type = settings =\> Processing Mode
 *         3. override_email_customer = settings =\> Email Receipts =\> Send Email Receipts To Customers: Yes or No
 *         4. override_trans_email = settings =\> Email Receipts =\> Receive Merchant Receipts: Yes or No
 *         5. RestrictKey = key if use Restrict Key is enabled \@ settings =\> RestrictKey
 *         6. Dsep = settings =\> Default Data Separator
 *         7. MAXMIND = "1" Use Maxmind (default if not sent).
 **/
export type DirectAPI = {
  /**
   * The login name for your official or developer Quantum Gateway account.
   * This is the same login name you use to log into the Quantum Gateway website.
   */
  gwlogin: string;

  /**
   * The transaction's payment method: either credit card (CC) or electronic funds transfer (EFT).
   */
  trans_method?: "CC" | "EFT";

  /**
   * How Quantum Gateway processes transaction requests.
   * This can be accessed in the Quantum Gateway website under Settings =\> Processing Settings =\> Processing Mode.
   */
  trans_type?: TransactionType;

  /**
   * An already existing / processed transaction ID. Can only be applied to the following transaction types: VOID, PREVIOUS_SALE.
   */
  transID?: string;

  /**
   * The transaction's credit card number. Required if the transaction method is CC.
   */
  ccnum?: string;

  /**
   * The transaction's credit card month. Required if the transaction method is CC.
   */
  ccmo?: string;

  /**
   * The transaction's credit card year. Required if the transaction method is CC.
   */
  ccyr?: string;

  /**
   * The transaction's Electronic Funds Transfer aba number. Required if the transaction method is EFT.
   */
  aba?: string;

  /**
   * The transaction's Electronic Funds Transfer checking account. Required if the transaction method is EFT.
   */
  checkacct?: string;

  /**
   * The transaction's purchase amount.
   */
  amount: string;

  /**
   * The billing address.
   */
  BADDR1?: string;

  /**
   * The billing zip code.
   */
  BZIP1?: string;

  /**
   * The billing's contact email address.
   */
  BCUST_EMAIL?: string;

  /**
   * Whether to send an email receipt to the customer.
   * - "Y" - Yes
   * - "N" - No
   * - Default: Settings =\> Processing Settings =\> Email Receipts =\> Send Email Receipts To Customers: Yes or No
   */
  override_email_customer?: "Y" | "N";

  /**
   * Whether to send an email receipt to the merchant.
   * - "Y" - Yes
   * - "N" - No
   * - Default: Settings =\> Processing Settings =\> Email Receipts =\> Receive Merchant Receipts: Yes or No
   */
  override_trans_email?: "Y" | "N";

  /**
   * Your key if use Restrict Key is enabled in the Quantum Gateway settings.
   * This can be accessed in the Quantum Gateway website under Settings =\> Processing Settings =\> RestrictKey.
   */
  RestrictKey?: string;

  /**
   * The billing contact's name.
   */
  BNAME?: string;

  /**
   * The credit card's security code.
   * Not required, but recommended.
   * You can see this in the Quantum Gateway website under Settings =\> Processing Settings =\> Required Form Items =\> Require CVV2.
   */
  CVV2?: string;

  /**
   * CVV options.
   * 0 - Not Passing CVV2
   * 1 - CVV2 is being passed
   * 2 - CVV2 on card is unreadable
   * 9 - Card does not have CVV2 imprint
   */
  CVVtype?: "0" | "1" | "2" | "9";

  /**
   * How items in the transaction response are separated.
   * This can be accessed in the Quantum Gateway website under Settings =\> Processing Settings =\> Default Data Separator.
   */
  Dsep?: string;

  /**
   * Whether to use Maxmind for fraud detection.
   * - "1" - Use Maxmind
   * - "2" - Do not use Maxmind
   * - Default: Settings =\> Processing Settings =\> Max Mind Fraud Control =\> Use Maxmind: Yes or No
   */
  MAXMIND?: "1" | "2";

  /**
   * Whether to override a transaction recipe id's recurring amount.
   * This setting only applies to recurring recipes with the "Honor Trans Amount" amount setting set to "N".
   * You can see this in the quantum gateway settings under Processing Tools =\> Recurring Billing =\> View Recipes
   *    - You'll then see a table of all of the recipes you've created and a column with header Honor Trans Amount.
   *    - If Honor Trans Amount is "Y" then the transaction (tx) will ALWAYS use the transaction's set amount, regardless of override_recur.
   *    - If the value is "N," then the tx will only use the tx's set amount if override_recur is set to "Y". Otherwise, it will use the recipe's default recurring amount in its settings.
   * You can change a specific recipe's value by going to the recipe's edit page and clicking the checkbox "Honor Transaction Amount instead of Recurring Amount Above" on or off.
   *
   * TODO: BUG: We assumed that this value could take N, but quantum Gateway's API only accepts Y.
   */
  override_recur?: "Y" | "N";

  /**
   * The recurring recipe ID that this transaction will be associated with. Recurring Recipe IDs are something that you create in the Quantum Gateway website under Processing Tools =\> Recurring Billing =\> New Recipe. Or you can use an existing recipe ID.
   * This can be found in Processing Tools =\> Recurring Billing =\> View Recipes
   */
  RID?: string;

  /**
   * If this is set to a number, then this is the first payment that will be charged. This number is separate from the recurring amount.
   * The recurring amount will be either the amount set in the transaction or the amount set in the recipe.
   * The choice for either is dependent on your settings and the value of override_recur.
   */
  initial_amount?: string;

  /**
   * The amount of times this transaction will recur.
   */
  recur_times?: string;

  /**
   * Override the default recurring day for the recipe id.
   * If this is set to Y, then the recurring day will be set to the day of the month that this transaction is being processed.
   */
  OverRideRecureDay?: "Y" | "N";
};

/**
 * ### Description
 *  How Quantum Gateway processes transactions.
 */
export enum TransactionType {
  /**
   * a charge that uses default Processing Settings. Processing Settings is at Quantum Gateway Login =\> Settings =\> Processing Settings.
   */
  "CREDIT" = "CREDIT",
  /**
   * same as CREDIT, is a charge but will bypass the Processing Settings. SALE does not use AVS and CVV2 settings.
   */
  "SALE" = "SALE",
  /**
   * an auth and if AVS and CVV2 settings pass then it will be converted to a sale.
   */
  "AUTH_CAPTURE" = "AUTH_CAPTURE",
  /**
   * a auth to see if the credit card is good and has the fund and will bypass the Processing Settings. AUTH_ONLY does not use AVS and CVV2 settings.
   */
  "AUTH_ONLY" = "AUTH_ONLY",
  /**
   * a refund. Requires full credit card information.
   */
  "RETURN" = "RETURN",
  /**
   * requires transID - The TransactionID
   */
  "VOID" = "VOID",
  /**
   * requires transID - The TransactionID
   */
  "PREVIOUS_SALE" = "PREVIOUS_SALE",
}
