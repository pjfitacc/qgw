import {
  Expose,
  Type,
  plainToInstance,
  instanceToPlain,
} from "class-transformer";
import { DirectAPI, TransactionType } from "../api";
import {
  toggle1or2,
  toggleYesOrNO,
} from "../../utils/transparent-qgw-db-engine";

/**
 * ### Description
 *  Some of the available options you can set for a Transparent API Transaction.
 *  These were the Transparent API options that the author decided could be grouped as Optional.
 *  Other configurable options are available throughout various classes within the TransactionRequest class.
 *
 * @privateRemarks
 * Options Class to DirectAPI mapping:
 *  - emailCustomerReceipt: override_email_customer "Y" | "N";
 *  - sendTransactionEmail: override_trans_email "Y" | "N";
 *  - transactionType: trans_type
 *  - transactionID: transID
 *  - restrictKey: RestrictKey
 *  - dataSeparator: Dsep
 *  - maxMindOn: MAXMIND "1" | "2";
 *
 */
export class OptionsFieldsModel {
  /**
   * Whether to send an email receipt to the customer.
   * - Default: Settings => Processing Settings => Email Receipts => Send Email Receipts To Customers: Yes or No
   */
  @Expose()
  emailCustomerReceipt?: boolean;

  /**
   * Whether to send an email receipt to the merchant.
   * - Default: Settings => Processing Settings => Email Receipts => Receive Merchant Receipts: Yes or No
   */
  @Expose()
  sendTransactionEmail?: boolean;

  /**
   * How Quantum Gateway processes transaction requests.
   * This can be accessed in the Quantum Gateway website under Settings => Processing Settings => Processing Mode.
   */
  @Expose()
  transactionType?: TransactionType;

  /**
   * An already existing / processed transaction ID. Can only be applied to the following transaction types: VOID, PREVIOUS_SALE.
   */
  @Expose()
  transactionID?: string;

  /**
   * Your key if use Restrict Key is enabled in the Quantum Gateway settings.
   */
  @Expose()
  restrictKey?: string;

  /**
   * How items in the transaction response are separated.
   */
  @Expose()
  dataSeparator?: string;

  /**
   * Whether to use Maxmind for fraud detection.
   */
  @Expose()
  maxMindOn?: boolean;
}

/**
 * ### Description
 *  Wrapper class for the DirectAPI Options. TransactionRequest class uses this class to set the options for the transaction.
 *
 */
export class Options {
  /** @hidden */
  public directApiFields: DirectApiOptionsFields;

  @Type(() => OptionsFieldsModel)
  @Expose()
  public optionsFields?: OptionsFieldsModel;

  /**
   * @param optionsFields - The fields to configure the transaction.
   */
  constructor(optionsFields?: OptionsFieldsModel) {
    this.optionsFields = optionsFields;

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

  static fromJSON(json: any): Options {
    const fields = plainToInstance(OptionsFieldsModel, json);
    return new Options(fields);
  }

  toJSON(): any {
    return instanceToPlain(this.optionsFields);
  }
}

export type OptionsFields = OptionsFieldsModel;

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
