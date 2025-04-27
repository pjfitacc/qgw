import CustomError from "./custom-error";
import { TransactionErrorCode } from "./types";

/*
Our own custom error class that throws issues during any part of the transaction process within the TransparentDBEngine,
whether that is formatting issues prior to the transaction or issues after the transaction's been sent
*/
class TransactionError extends CustomError<TransactionErrorCode> {}

export default TransactionError;
