import TransactionError from "../../errors/transaction-error";

/**
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
 *  This class is used to parse a successful response string from the Quantum Gateway server.
 *  The response string is a single delimiter-separated string (default is the pipe: | ) that contains the following fields according to Transparent API:
 *  result,authcode,transID,AVRResponse,CVV Response,Max Score,decline_reason(if any),Error Code(if any)
 *  This string MUST be split into an array of strings before being passed to the constructor.
 *  {@link parsePipeDelimitedResponse} function in the transparent-qgw-db-engine module under utils should be used to parse the response string.
 *
 * @remarks
 * The only supported response string delimiter for this library is the pipe: |.
 *
 */
export class TransactionResponse {
  /*
  result,authcode,transID,AVRResponse,CVV Response,Max Score,decline_reason(if any),Error Code(if any)
  "APPROVED","019452","65735","Y","M","0.3"
  "DECLINED","019452","65735","Y","M","0.3","Auth Declined","200" 
  */
  result: "APPROVED" | "DECLINED"; // result
  authCode: string; // authcode
  transID: string; // transID
  avrResponse: string; // AVRResponse
  cvvResponse: string; // CVV Response
  maxScore: string; // Max Score
  declineReason?: string; // decline_reason(if any)
  errorCode?: string; // Error Code(if any)
  last4Digits?: string; // Found from PostMan response
  creditCardProvider?: string; // Found from Postman response

  // Example from PostMan: "APPROVED"|"604151"|"87646222"|""|"M"|""|"5454"|"MC"|"0"
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
