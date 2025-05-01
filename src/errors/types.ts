/**
 *
 */
export type TransactionErrorCode =
  /**
   * When a Transaction Request's fields sent to the Engine Library is improperly formatted..
   */
  | "ERR_PARSE"
  /**
   * An error originating from quantum gateway server before a transaction was processed.
   */
  | "ERR_SERVER_RESPONSE"
  /**
   * An error originating from quantum gateway server after a transaction was processed and was declined.
   */
  | "ERR_SERVER_DECLINED";
