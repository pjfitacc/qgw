export class TransactionResponse {}

export class TransparentDatabaseEngine {
  public gatewayLogin: string;
  postURL: string = "https://secure.quantumgateway.com/cgi/tqgwdbe.php";

  constructor(gatewayLogin: string) {
    this.gatewayLogin = gatewayLogin;
  }

  sendTransaction(transaction: Transaction): TransactionResponse {
    if (this.validate(transaction)) {
      return TransactionResponse;
    }
    return TransactionResponse;
  }

  validate(transaction: Transaction): boolean {
    if (transaction.amount) {
      return true;
    }
    return false;
  }
}

export class Transaction {
  public amount: number;
  public billingInfo: BillingInfo;
  public transactionOptions?: TransactionOptions;
  public payment: CreditCard | ElectronicFundsTransfer;

  constructor(
    amount: number,
    billingInfo: BillingInfo,
    payment: CreditCard | ElectronicFundsTransfer,
    transactionOptions?: TransactionOptions
  ) {
    this.amount = amount;
    this.billingInfo = billingInfo;
    this.transactionOptions = transactionOptions;
    this.payment = payment;
  }
}

export type BillingInfo = {
  address: string;
  zip: string;
  email: string;
  name?: string;
};

export type TransactionOptions = {
  transactionType?: TransactionType;
  transactionID?: string;
  restrictKey?: string;
  dataSeparator?: string;
  maxMindOn?: boolean;
  emailCustomerReceipt?: boolean;
  sendTransactionEmail?: boolean;
};

export enum TransactionType {
  "CREDIT",
  "SALES",
  "AUTH_CAPTURE",
  "AUTH_ONLY",
  "RETURN",
  "VOID",
  "PREVIOUS_SALE",
}

export type CreditCard = {
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv2: string;
  cvvType: string;
};

export type ElectronicFundsTransfer = {
  aba: string;
  checkingAccountNumber: string;
};

export class RecurringTransaction extends Transaction {
  // TODO
}
