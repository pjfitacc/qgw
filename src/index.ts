export class TransactionResponse {}

export class TransparentDatabaseEngine {
  public gatewayLogin: string;
  postURL: string = "https://secure.quantumgateway.com/cgi/tqgwdbe.php";

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

export class Transaction {
  public amount: number;
  public billingInfo: BillingInfo;
  public payment: CreditCard | ElectronicFundsTransfer;
  public transactionOptions?: TransactionOptions;
  public recurringOptions?: RecurringOptions;

  constructor(
    amount: number,
    billingInfo: BillingInfo,
    payment: CreditCard | ElectronicFundsTransfer,
    transactionOptions?: TransactionOptions,
    recurringOptions?: RecurringOptions
  ) {
    this.amount = amount;
    this.billingInfo = billingInfo;
    this.transactionOptions = transactionOptions;
    this.payment = payment;
    this.recurringOptions = recurringOptions;
  }
}

export type BillingInfo = {
  address: string;
  zip: string;
  email: string;
  name?: string;
};

// TODO: Define Default transactionOptions & recurringOptions
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

// TODO: Define Default transactionOptions & recurringOptions
export type RecurringOptions = {
  rid: string;
  initialAmount: number;
  recurCycles: number;
  overrideRecurringPrice: boolean;
  overrideRecurringDay: boolean;
};
