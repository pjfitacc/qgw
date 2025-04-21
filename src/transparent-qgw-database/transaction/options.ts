import { DirectAPI, TransactionType } from "..";
import {
  toggleBinary,
  toggleYesOrNO,
} from "../../utils/transparent-qgw-db-engine";

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
    public emailCustomerReceipt?: boolean,
    public sendTransactionEmail?: boolean,
    public transactionType?: TransactionType,
    public transactionID?: string,
    public restrictKey?: string,
    public dataSeparator?: string,
    public maxMindOn?: boolean
  ) {
    this.fields = {
      override_email_customer: toggleYesOrNO(emailCustomerReceipt),
      override_trans_email: toggleYesOrNO(sendTransactionEmail),
      trans_type: transactionType,
      transID: transactionID,
      RestrictKey: restrictKey,
      Dsep: dataSeparator,
      MAXMIND: toggleBinary(maxMindOn),
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
