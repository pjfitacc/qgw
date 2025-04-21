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
    public emailCustomerReceipt?: boolean,
    public sendTransactionEmail?: boolean,
    public transactionType?: TransactionType,
    public transactionID?: string,
    public restrictKey?: string,
    public dataSeparator?: string,
    public maxMindOn?: boolean
  ) {
    type TransQgwBooleanOutput = {
      true: string;
      false: string;
    };

    function overrideTransQgwBoolOption<T extends TransQgwBooleanOutput>(
      setOption: boolean | undefined,
      booleanOutput = { true: "Y", false: "N" }
    ): T["true"] | T["false"] | undefined {
      if (setOption === undefined) return undefined;

      return setOption ? booleanOutput["true"] : booleanOutput["false"];
    }
    this.fields = {
      override_email_customer: overrideTransQgwBoolOption<{
        true: "Y";
        false: "N";
      }>(emailCustomerReceipt),
      override_trans_email: overrideTransQgwBoolOption<{
        true: "Y";
        false: "N";
      }>(sendTransactionEmail),
      trans_type: transactionType,
      transID: transactionID,
      RestrictKey: restrictKey,
      Dsep: dataSeparator,
      MAXMIND: overrideTransQgwBoolOption<{
        true: "1";
        false: "2";
      }>(maxMindOn, { true: "1", false: "2" }),
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
