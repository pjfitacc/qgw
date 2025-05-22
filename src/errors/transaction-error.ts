import { TransactionResponse } from "../transparent-db/transaction/response";
import { CustomIssue, CustomError } from "./custom-error";
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
 * If this TransactionError has a code of ERR_SERVER_DECLINED, then it will contain a {@link TransactionDeclinedIssue} as an item in its issues array field.
 *
 */
class TransactionError extends CustomError<TransactionErrorCode> {
  toString(): string {
    let issuesStr = "";

    if (this.issues.length > 0) {
      issuesStr = this.issues
        .map((issue) => {
          let issueStr = `{ code: ${issue.code}, message: "${issue.message}"`;

          // Handle TransactionDeclinedIssue case
          if ("serverResponse" in issue) {
            const declinedIssue = issue as TransactionDeclinedIssue;
            issueStr += `, serverResponse: ${declinedIssue.serverResponse.toString()}`;
          }

          // Add path if it exists
          if (issue.path && issue.path.length > 0) {
            issueStr += `, path: [${issue.path.join(", ")}]`;
          }

          issueStr += " }";
          return issueStr;
        })
        .join(", ");
    }

    return `TransactionError {
      code: ${this.code || "undefined"},
      message: "${this.message}",
      issues: [${issuesStr}]
    }`;
  }
}

export { TransactionError };
