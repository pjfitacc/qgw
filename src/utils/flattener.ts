// TODO:

import { TransparentDatabaseEngine } from "..";
import {
  BillingInfo,
  CreditCard,
  ElectronicFundsTransfer,
  PaymentMethod,
} from "../payment";
import { RecurringOptions } from "../recurring";
import {
  Transaction,
  TransactionOptions,
  TransactionType,
} from "../transaction";

// Take a Transaction Class from our API and flatten it into a JSON payload that Transparent Quantum Gateway Accepts
type RequiredTransQGWdbeFields = {
  readonly gwlogin: string;
  trans_method: "CC" | "EFT"; // "CC" or "EFT" depending on if class Transaction has CreditCard | ElectronicFundsTransfer type as its payment field.
  trans_type: TransactionType; // TransactionOptions.transctionType where transactioType is a TransactionType enum
  amount: ""; // Transaction.amount
  BADDR1: ""; // BillingInfo.address
  BZIP1: ""; // BillingInfo.zip
  BCUST_EMAIL: ""; // BillingInfo.email
  override_email_customer: ""; // TransactionOptions.emailCustomerReceipt
  override_trans_email: ""; // TransactionOptions.sendTransactionEmail
};

type OptionalTransQGWdbeFields = {
  transID?: ""; // TransactionOptions.transactionID
  ccnum?: ""; // CreditCard.number
  ccmo?: ""; // CreditCard.expirationMonth
  ccyr?: ""; // CreditCard.expirationYear
  aba?: ""; // ElectronicFundsTransfer.aba
  checkacct?: ""; // ElectronicFundsTransfer.checkingAccountNumber
  BNAME?: ""; // BillingInfo.name
  CVV2?: ""; // CreditCard.cvv2
  CVVtype?: ""; // CreditCard.cvvType
  RestrictKey?: ""; // TransactionOptions.restrictKey
  Dsep?: ""; // TransactionOptions.dataSeparator
  MAXMIND?: ""; // TransactionOptions.maxMindOn
  override_recur?: ""; // RecurringOptions.overrideRecurringPrice
  RID?: ""; // RecurringOptions.rid
  initial_amount?: ""; // RecurringOptions.initialAmount
  recur_times?: ""; // RecurringOptions.recurCycles
  OverRideRecureDay?: ""; // RecurringOptions.overrideRecurringDay
};

type TransQGWdbePayload = RequiredTransQGWdbeFields & OptionalTransQGWdbeFields;

const exhaustiveMatchingGuard = (_: never): never => {
  throw new Error("Should not have reached here");
};

function setPayloadPaymentInfo(payload: any, paymentMethod: PaymentMethod) {
  // Determine trans_method
  switch (paymentMethod.method) {
    case "CREDIT_CARD":
      // TypeScript knows `payment` is CreditCard
      payload.trans_method = "CC";
      setPayloadCreditCardInfo(payload, paymentMethod);
      break;
    case "EFT":
      payload.trans_method = "EFT";
      // TypeScript knows `payment` is ElectronicFundsTransfer
      setPayloadElectronicFundsTransferInfo(payload, paymentMethod);
      break;
    default:
      return exhaustiveMatchingGuard(paymentMethod);
  }
}

function setPayloadCreditCardInfo(payload: any, creditCard: CreditCard) {
  payload.ccnum = creditCard.number;
  payload.ccmo = creditCard.expirationMonth;
  payload.ccyr = creditCard.expirationYear;
  payload.CVV2 = creditCard.cvv2;
  payload.CVVtype = creditCard.cvvType;
}

function setPayloadElectronicFundsTransferInfo(
  payload: any,
  eft: ElectronicFundsTransfer
) {
  payload.aba = eft.aba;
  payload.checkacct = eft.checkingAccountNumber;
}

function setPayloadBillingInfo(payload: any, billingInfo: BillingInfo) {
  payload.BADDR1 = billingInfo.address;
  payload.BZIP1 = billingInfo.zip;
  payload.BCUST_EMAIL = billingInfo.email;
  if (billingInfo.name) {
    payload.BNAME = billingInfo.name;
  }
}
function setPayloadTransactionOptions(
  payload: any,
  transactionOptions: TransactionOptions | undefined
) {
  if (transactionOptions) {
    payload.transID = transactionOptions.transactionID ?? "";
    payload.RestrictKey = transactionOptions.restrictKey ?? "";
    payload.Dsep = transactionOptions.dataSeparator ?? "";
    payload.MAXMIND = transactionOptions.maxMindOn ? "1" : "2";
    payload.override_email_customer = transactionOptions.emailCustomerReceipt
      ? "Y"
      : "N";
    payload.override_trans_email = transactionOptions.sendTransactionEmail
      ? "Y"
      : "N";
  }
}

function setPayloadRecurringOptions(
  payload: any,
  recurringOptions: RecurringOptions | undefined
) {
  if (recurringOptions) {
    payload.override_recur = recurringOptions.overrideRecurringPrice
      ? "Y"
      : "N";
    payload.RID = recurringOptions.rid;
    payload.initial_amount = recurringOptions.initialAmount.toString();
    payload.recur_times = recurringOptions.recurCycles.toString();
    payload.OverRideRecureDay = recurringOptions.overrideRecurringDay
      ? "Y"
      : "N";
  }
}

export function mapTransactionToPayload(
  transaction: Transaction
): TransQGWdbePayload {
  const payload: any = {};

  payload.gwlogin = TransparentDatabaseEngine.postURL;
  payload.amount = transaction.amount.toString();
  payload.trans_type = transaction.transactionOptions?.transactionType ?? "";

  setPayloadPaymentInfo(payload, transaction.payment);
  setPayloadBillingInfo(payload, transaction.billingInfo);
  setPayloadTransactionOptions(payload, transaction.transactionOptions);
  setPayloadRecurringOptions(payload, transaction.recurringOptions);

  return payload;
}
