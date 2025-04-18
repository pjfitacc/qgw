import { DirectAPI, TransactionType } from "..";

// https://stackoverflow.com/a/54126250
export class DirectAPIBuilder implements Partial<DirectAPI> {
  gwlogin?: string;
  trans_method?: "CC" | "EFT";
  trans_type?: TransactionType;
  transID?: string;
  ccnum?: string;
  ccmo?: string;
  ccyr?: string;
  aba?: string;
  checkacct?: string;
  amount?: string;
  BADDR1?: string;
  BZIP1?: string;
  BCUST_EMAIL?: string;
  override_email_customer?: "Y" | "N";
  override_trans_email?: "Y" | "N";
  RestrictKey?: string;
  BNAME?: string;
  CVV2?: string;
  CVVtype?: "0" | "1" | "2" | "9";
  Dsep?: string;
  MAXMIND?: "1" | "2";
  override_recur?: "Y" | "N";
  RID?: string;
  initial_amount?: string;
  recur_times?: string;
  OverRideRecureDay?: "Y" | "N";

  // Required fields
  withGwlogin(value: string): this & Pick<DirectAPI, "gwlogin"> {
    return Object.assign(this, { gwlogin: value });
  }

  withAmount(value: string): this & Pick<DirectAPI, "amount"> {
    return Object.assign(this, { amount: value });
  }

  withBADDR1(value: string): this & Pick<DirectAPI, "BADDR1"> {
    return Object.assign(this, { BADDR1: value });
  }

  withBZIP1(value: string): this & Pick<DirectAPI, "BZIP1"> {
    return Object.assign(this, { BZIP1: value });
  }

  withBCUST_EMAIL(value: string): this & Pick<DirectAPI, "BCUST_EMAIL"> {
    return Object.assign(this, { BCUST_EMAIL: value });
  }

  withOverrideEmailCustomer(
    value: "Y" | "N"
  ): this & Pick<DirectAPI, "override_email_customer"> {
    return Object.assign(this, { override_email_customer: value });
  }

  withOverrideTransEmail(
    value: "Y" | "N"
  ): this & Pick<DirectAPI, "override_trans_email"> {
    return Object.assign(this, { override_trans_email: value });
  }

  // Optional fields
  withTransMethod(
    value: "CC" | "EFT"
  ): this & Required<Pick<DirectAPI, "trans_method">> {
    return Object.assign(this, { trans_method: value });
  }

  withTransType(
    value: TransactionType
  ): this & Required<Pick<DirectAPI, "trans_type">> {
    return Object.assign(this, { trans_type: value });
  }

  withTransID(value: string): this & Required<Pick<DirectAPI, "transID">> {
    return Object.assign(this, { transID: value });
  }

  withCcnum(value: string): this & Required<Pick<DirectAPI, "ccnum">> {
    return Object.assign(this, { ccnum: value });
  }

  withCcmo(value: string): this & Required<Pick<DirectAPI, "ccmo">> {
    return Object.assign(this, { ccmo: value });
  }

  withCcyr(value: string): this & Required<Pick<DirectAPI, "ccyr">> {
    return Object.assign(this, { ccyr: value });
  }

  withAba(value: string): this & Required<Pick<DirectAPI, "aba">> {
    return Object.assign(this, { aba: value });
  }

  withCheckacct(value: string): this & Required<Pick<DirectAPI, "checkacct">> {
    return Object.assign(this, { checkacct: value });
  }

  withRestrictKey(
    value: string
  ): this & Required<Pick<DirectAPI, "RestrictKey">> {
    return Object.assign(this, { RestrictKey: value });
  }

  withBNAME(value: string): this & Required<Pick<DirectAPI, "BNAME">> {
    return Object.assign(this, { BNAME: value });
  }

  withCVV2(value: string): this & Required<Pick<DirectAPI, "CVV2">> {
    return Object.assign(this, { CVV2: value });
  }

  withCVVtype(
    value: "0" | "1" | "2" | "9"
  ): this & Required<Pick<DirectAPI, "CVVtype">> {
    return Object.assign(this, { CVVtype: value });
  }

  withDsep(value: string): this & Required<Pick<DirectAPI, "Dsep">> {
    return Object.assign(this, { Dsep: value });
  }

  withMAXMIND(value: "1" | "2"): this & Required<Pick<DirectAPI, "MAXMIND">> {
    return Object.assign(this, { MAXMIND: value });
  }

  withOverrideRecur(
    value: "Y" | "N"
  ): this & Required<Pick<DirectAPI, "override_recur">> {
    return Object.assign(this, { override_recur: value });
  }

  withRID(value: string): this & Required<Pick<DirectAPI, "RID">> {
    return Object.assign(this, { RID: value });
  }

  withInitialAmount(
    value: string
  ): this & Required<Pick<DirectAPI, "initial_amount">> {
    return Object.assign(this, { initial_amount: value });
  }

  withRecurTimes(
    value: string
  ): this & Required<Pick<DirectAPI, "recur_times">> {
    return Object.assign(this, { recur_times: value });
  }

  withOverRideRecureDay(
    value: "Y" | "N"
  ): this & Required<Pick<DirectAPI, "OverRideRecureDay">> {
    return Object.assign(this, { OverRideRecureDay: value });
  }

  build(this: DirectAPI): DirectAPI {
    return { ...this };
  }
}
