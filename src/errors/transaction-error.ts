import { ZodError } from "zod";

/*
Our own custom error class that throws issues during any part of the transaction process within the TransparentDBEngine,
whether that is formatting issues prior to the transaction or issues after the transaction's been sent
*/
class TransactionError extends ZodError<TransactionErrorCode> {}

export default TransactionError;
