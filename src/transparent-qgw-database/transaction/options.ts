import { DirectAPI, TransactionType } from "..";

// Options:
// emailCustomerReceipt: override_email_customer "Y" | "N";
// sendTransactionEmail: override_trans_email "Y" | "N";
// transactionType: trans_type
// transactionID: transID
// restrictKey: RestrictKey
// dataSeparator: Dsep
// maxMindOn: MAXMIND "1" | "2";
export class Options {
  public fields: OptionsFields;
  constructor(
    public emailCustomerReceipt: boolean = true,
    public sendTransactionEmail: boolean = true,
    public transactionType?: TransactionType,
    public transactionID?: string,
    public restrictKey?: string,
    public dataSeparator?: string,
    public maxMindOn?: boolean
  ) {
    this.fields = {
      override_email_customer: emailCustomerReceipt ? "Y" : "N",
      override_trans_email: sendTransactionEmail ? "Y" : "N",
      trans_type: transactionType,
      transID: transactionID,
      RestrictKey: restrictKey,
      Dsep: dataSeparator,
      MAXMIND: maxMindOn ? "1" : "2",
    };
  }
}

export type OptionsFields = Pick<
  DirectAPI,
  | "override_email_customer"
  | "override_trans_email"
  | "trans_type"
  | "transID"
  | "RestrictKey"
  | "Dsep"
  | "MAXMIND"
>;
