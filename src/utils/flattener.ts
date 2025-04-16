// TODO:

import { TransparentDatabaseEngine } from "..";
import { Transaction, TransactionType } from "../transaction";

// Take a Transaction Class from our API and flatten it into a JSON payload that Transparent Quantum Gateway Accepts
type TransQGWdbePayload = {
  readonly gwlogin: string;
  amount: string; // Transaction.amount
  BADDR1: string; // BillingInfo.address
  BZIP1: string; // BillingInfo.zip
  BCUST_EMAIL: string; // BillingInfo.email
  override_email_customer: "Y" | "N"; // TransactionOptions.emailCustomerReceipt
  override_trans_email: "Y" | "N"; // TransactionOptions.sendTransactionEmail
  trans_method?: "CC" | "EFT"; // "CC" or "EFT" depending on if class Transaction has CreditCard | ElectronicFundsTransfer type as its payment field.
  trans_type?: TransactionType; // TransactionOptions.transctionType where transactioType is a TransactionType enum
  transID?: string; // TransactionOptions.transactionID
  ccnum?: string; // CreditCard.number
  ccmo?: string; // CreditCard.expirationMonth
  ccyr?: string; // CreditCard.expirationYear
  aba?: string; // ElectronicFundsTransfer.aba
  checkacct?: string; // ElectronicFundsTransfer.checkingAccountNumber
  BNAME?: string; // BillingInfo.name
  CVV2?: string; // CreditCard.cvv2
  CVVtype?: string; // CreditCard.cvvType
  RestrictKey?: string; // TransactionOptions.restrictKey
  Dsep?: string; // TransactionOptions.dataSeparator
  MAXMIND?: "1" | "2"; // TransactionOptions.maxMindOn
  override_recur?: "Y" | "N"; // RecurringOptions.overrideRecurringPrice
  RID?: string; // RecurringOptions.rid
  initial_amount?: string; // RecurringOptions.initialAmount
  recur_times?: string; // RecurringOptions.recurCycles
  OverRideRecureDay?: "Y" | "N"; // RecurringOptions.overrideRecurringDay
};

export function mapTransactionToPayload(
  transaction: Transaction
): TransQGWdbePayload {
  return {
    gwlogin: TransparentDatabaseEngine.postURL,
    amount: transaction.amount.toString(),
    ...transaction.billingInfo,
    ...transaction.transactionOptions,
    ...transaction.payment,
    ...transaction.recurringOptions,
  };
}
