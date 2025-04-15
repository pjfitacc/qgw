import { BillingInfo, CreditCard, ElectronicFundsTransfer } from "./payment";
import { RecurringOptions } from "./recurring";

export class TransactionResponse {}

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
