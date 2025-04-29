import { TransactionResponse } from "../transparent-qgw-database/transaction/response";
import CustomError, { CustomIssue } from "./custom-error";
import { TransactionErrorCode } from "./types";

/**
 *
 *
 * @extends {CustomIssue}
 */
export interface TransactionDeclinedIssue extends CustomIssue {
  serverResponse: TransactionResponse;
}

/**
 * Our own custom error class that throws issues during any part of the transaction process within the TransparentDBEngine,
 * whether that is formatting issues prior to the transaction or issues after the transaction's been sent
 *
 * @class TransactionError
 * @extends {CustomError<TransactionErrorCode>}
 */
class TransactionError extends CustomError<TransactionErrorCode> {}

export default TransactionError;
