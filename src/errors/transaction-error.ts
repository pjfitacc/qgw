import { TransactionResponse } from "../transparent-db/transaction/response";
import CustomError, { CustomIssue } from "./custom-error";
import { TransactionErrorCode } from "./types";

/**
 * ### Description
 *  Used to provide more information about why Quantum Gateway declined a transaction.
 *  It wraps all of the error information in the serverReponse field.
 *  Since this issue only occurs when the transaction is declined, the result field will always be "DECLINED".
 *
 */
export interface TransactionDeclinedIssue extends CustomIssue {
  serverResponse: TransactionResponse;
}

/**
 * ### Description
 *  Throws issues during any part of the transaction process within the TransparentDBEngine,
 *  whether that is formatting issues prior to the transaction or issues after the transaction's been sent
 *  The CustomIssues are used to provide more information about the error.
 *
 */
class TransactionError extends CustomError<TransactionErrorCode> {}

export { TransactionError };
