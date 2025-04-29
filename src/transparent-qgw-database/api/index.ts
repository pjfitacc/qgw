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
  gwlogin: string;
  trans_method?: "CC" | "EFT";
  trans_type?: TransactionType;
  transID?: string;
  ccnum?: string;
  ccmo?: string;
  ccyr?: string;
  aba?: string;
  checkacct?: string;
  amount: string;
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
};

/**
 * ### Description
 *  How Quantum Gateway processes transactions.
 *
 * ### Transaction Types
 *  - CREDIT - a charge that uses default Processing Settings. Processing Settings is at Quantum Gateway Login =\> Settings =\> Processing Settings.
 *  - SALE - same as CREDIT, is a charge but will bypass the Processing Settings. SALE does not use AVS and CVV2 settings.
 *  - AUTH_CAPTURE - an auth and if AVS and CVV2 settings pass then it will be converted to a sale.
 *  - AUTH_ONLY - a auth to see if the credit card is good and has the fund and will bypass the Processing Settings. AUTH_ONLY does not use AVS and CVV2 settings.
 *  - RETURN - a refund. Requires full credit card information.
 *  - VOID and PREVIOUS_SALE - require transID - The TransactionID
 */
export enum TransactionType {
  "CREDIT" = "CREDIT",
  "SALE" = "SALE",
  "AUTH_CAPTURE" = "AUTH_CAPTURE",
  "AUTH_ONLY" = "AUTH_ONLY",
  "RETURN" = "RETURN",
  "VOID" = "VOID",
  "PREVIOUS_SALE" = "PREVIOUS_SALE",
}
