import { Transaction, TransactionResponse } from "./transaction";

export class TransparentDatabaseEngine {
  public gatewayLogin: string;
  static postURL: string = "https://secure.quantumgateway.com/cgi/tqgwdbe.php";

  constructor(gatewayLogin: string) {
    this.gatewayLogin = gatewayLogin;
  }

  sendTransaction(transaction: Transaction): TransactionResponse {
    // TODO
    if (this.validate(transaction)) {
      return TransactionResponse;
    }
    return TransactionResponse;
  }

  validate(transaction: Transaction): boolean {
    // TODO
    if (transaction.amount) {
      return true;
    }
    return false;
  }

  convertToPayload(transaction: Transaction) {}
}
