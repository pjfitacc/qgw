import { DirectAPI, TransactionType } from "../api";
import {
  toggle1or2,
  toggleYesOrNO,
} from "../../utils/transparent-qgw-db-engine";

/**
 *
 */
export type OptionsFields = {
  emailCustomerReceipt?: boolean;
  sendTransactionEmail?: boolean;
  transactionType?: TransactionType;
  transactionID?: string;
  restrictKey?: string;
  dataSeparator?: string;
  maxMindOn?: boolean;
};

/**
 * Options:
 * emailCustomerReceipt: override_email_customer "Y" | "N";
 * sendTransactionEmail: override_trans_email "Y" | "N";
 * transactionType: trans_type
 * transactionID: transID
 * restrictKey: RestrictKey
 * dataSeparator: Dsep
 * maxMindOn: MAXMIND "1" | "2";
 *
 * @export
 * @class Options
 */
export class Options {
  public directApiFields: DirectApiOptionsFields;
  constructor(optionsFields?: OptionsFields) {
    this.directApiFields = {
      override_email_customer: toggleYesOrNO(
        optionsFields?.emailCustomerReceipt
      ),
      override_trans_email: toggleYesOrNO(optionsFields?.sendTransactionEmail),
      trans_type: optionsFields?.transactionType,
      transID: optionsFields?.transactionID,
      RestrictKey: optionsFields?.restrictKey,
      Dsep: optionsFields?.dataSeparator,
      MAXMIND: toggle1or2(optionsFields?.maxMindOn),
    };
  }
}

export type DirectApiOptionsFields = Pick<
  DirectAPI,
  | "override_email_customer"
  | "override_trans_email"
  | "trans_type"
  | "transID"
  | "RestrictKey"
  | "Dsep"
  | "MAXMIND"
>;
