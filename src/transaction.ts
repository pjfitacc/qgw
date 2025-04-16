import { BillingInfo } from "./billing";
import { PaymentMethod } from "./payment";
import { RecurringOptions } from "./recurring";

export class TransactionResponse {}

export class Transaction {
  public amount: number | string;
  public billingInfo: BillingInfo;
  public payment: PaymentMethod;
  public transactionOptions: TransactionOptions;
  public recurringOptions: RecurringOptions;

  constructor(
    amount: number | string,
    billingInfo: BillingInfo,
    payment: PaymentMethod,
    transactionOptions: TransactionOptions,
    recurringOptions: RecurringOptions
  ) {
    this.amount = amount;
    this.billingInfo = billingInfo;
    this.transactionOptions = transactionOptions;
    this.payment = payment;
    this.recurringOptions = recurringOptions;
  }
}

export type TransactionOptions = {
  override_email_customer: "Y" | "N";
  override_trans_email: "Y" | "N";
  trans_method?: "CC" | "EFT";
  trans_type?: TransactionType;
  transID?: string;
  RestrictKey?: string;
  Dsep?: string;
  MAXMIND?: "1" | "2";
};

export enum TransactionType {
  "CREDIT" = "CREDIT",
  "SALES" = "SALES",
  "AUTH_CAPTURE" = "AUTH_CAPTURE",
  "AUTH_ONLY" = "AUTH_ONLY",
  "RETURN" = "RETURN",
  "VOID" = "VOID",
  "PREVIOUS_SALE" = "PREVIOUS_SALE",
}
