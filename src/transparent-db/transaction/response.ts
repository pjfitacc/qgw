import { TransactionError } from "../../errors/transaction-error";

/**
 * @privateRemarks
 * This enum is private to the class. The fields associated with these enums
 * will be publicly available in the TransactionResponse class.
 *
 */
enum ServerResponseFieldIndexes {
  "RESULT",
  "AUTH_CODE",
  "TRANS_ID",
  "AVR_RESPONSE",
  "CVV_RESPONSE",
  "MAX_SCORE",
  "DECLINE_REASON",
  "ERROR_CODE",
}

/**
 * ### Description
 *  The response items from the Transparent DB Engine if a transaction has been fully processed, present in this class's fields.
 */
export class TransactionResponse {
  /**
   * @privateRemarks
   * result
   */
  result: "APPROVED" | "DECLINED";

  /**
   * The author does not know what this field is. It is not documented in the Transparent API documentation.
   * It is a string that is returned in the response string from the Transparent API.
   * @privateRemarks authcode
   */
  authCode: string;

  /**
   * The transaction ID of the processed transaction.
   *
   * @privateRemarks transID
   */
  transID: string;

  /**
   * The author does not know what this field is. It is not documented in the Transparent API documentation.
   * It is a string that is returned in the response string from the Transparent API.
   *
   * It could be a misspelling of AVS Response, which is a common term in payment processing.
   * If so, you can find more information about Quantum Gateway's AVS Responses here: https://secure.quantumgateway.com/merchant/AVS_codes.php
   * @privateRemarks AVRResponse
   */
  avrResponse: string;

  /**
   * Possible CVV2 response values:
   * Code   Value Description
   * M	    CVV2 Match
   * N	    CVV2 No Match
   * P	    Not Processed
   * S	    Issuer indicates that CVV2 data should be present on the card, but the merchant has indicated data is not present on the card
   * U	    Issuer has not certified for CVV2 or Issuer has not provided Visa with the CVV2 encryption keys
   * Empty	Transaction failed because wrong CVV2 number was entered or no CVV2 number was entered
   * Y      ?
   *
   * More detailed responses can be found in: https://secure.quantumgateway.com/merchant/processing_config.php => Processing Mode
   *
   * The CVV2 responses that you receive depend on the {@link transparent-db/api.TransactionType} you are using. This can be also found in the link above.
   *
   * @privateRemarks CVV Response
   */
  cvvResponse: string;

  /**
   * Max Mind Fraud Control Score.
   *
   * You can tweak the score to your liking in QGW: https://secure.quantumgateway.com/merchant/processing_config.php =>  Max Mind Fraud Control
   * @privateRemarks Max Score
   */
  maxScore: string;

  /**
   * Only present if the result is DECLINED.
   * @privateRemarks
   * decline_reason(if any)
   */
  declineReason?: string;

  /**
   * Only present if the result is DECLINED.
   * Transaction Errors can be found here: https://secure.quantumgateway.com/merchant/authorization_errors.php
   * @privateRemarks
   * Error Code(if any)
   */
  errorCode?: string;

  /**
   * * Only present if the result is APPROVED.
   * The last 4 digits of the credit card number used in the transaction.
   * @privateRemarks
   * last4Digits
   */
  last4Digits?: string;

  /**
   * Only present if the result is APPROVED.
   * The credit card provider used in the transaction, abbreviated.
   * @privateRemarks
   * creditCardProvider
   */
  creditCardProvider?: string;

  /**
   *
   *  @privateRemarks
   *  TODO: The only supported response string delimiter for this library is the pipe: |.
   *  The response string is a single delimiter-separated string (default is the pipe: | ) that contains the following fields according to Transparent API:
   *  result,authcode,transID,AVRResponse,CVV Response,Max Score,decline_reason(if any),Error Code(if any)
   *  This string MUST be split into an array of strings before being passed to the constructor.
   *
   *  Transparent API response string example:
   *  result,authcode,transID,AVRResponse,CVV Response,Max Score,decline_reason(if any),Error Code(if any)
   *  "APPROVED","019452","65735","Y","M","0.3"
   *  "DECLINED","019452","65735","Y","M","0.3","Auth Declined","200"
   *
   *  Example from PostMan:
   *  "APPROVED"|"604151"|"87646222"|""|"M"|""|"5454"|"MC"|"0"
   *
   *  {@link parsePipeDelimitedResponse} function in the transparent-qgw-db-engine module under utils should be used to parse the response string.
   */
  constructor(responseString: string[]) {
    const result = responseString[ServerResponseFieldIndexes.RESULT];
    if (result !== "APPROVED" && result !== "DECLINED") {
      throw new TransactionError({
        message:
          "Quantum Gateway did not provide an APPROVED or DECLINED result.",
        issues: [],
        code: "ERR_SERVER_RESPONSE",
      });
    }
    this.result = result;
    this.authCode = responseString[ServerResponseFieldIndexes.AUTH_CODE];
    this.transID = responseString?.[ServerResponseFieldIndexes.TRANS_ID] ?? "";
    this.avrResponse =
      responseString?.[ServerResponseFieldIndexes.AVR_RESPONSE] ?? "";
    this.cvvResponse =
      responseString?.[ServerResponseFieldIndexes.CVV_RESPONSE] ?? "";
    this.maxScore =
      responseString?.[ServerResponseFieldIndexes.MAX_SCORE] ?? "";

    if (result === "DECLINED") {
      this.declineReason =
        responseString?.[ServerResponseFieldIndexes.DECLINE_REASON] ?? "";
      this.errorCode =
        responseString?.[ServerResponseFieldIndexes.ERROR_CODE] ?? "";
    } else {
      this.last4Digits =
        responseString?.[ServerResponseFieldIndexes.MAX_SCORE + 1] ?? "";
      this.creditCardProvider =
        responseString?.[ServerResponseFieldIndexes.MAX_SCORE + 2] ?? "";
    }
  }
}
