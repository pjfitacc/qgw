import { DirectAPI } from "../api";

// Payer Class:
// - address: BADDR1
// - zip: BZIP1
// - email: BCUST_EMAIL
// - name: BNAME

export class Payer {
  public directApiFields: PayerFields;
  constructor(
    public address: string,
    public zip: string,
    public email: string,
    public name: string = "anonymous"
  ) {
    this.directApiFields = {
      BADDR1: address,
      BZIP1: zip,
      BCUST_EMAIL: email,
      BNAME: name,
    };
  }
}

export type PayerFields = Pick<
  DirectAPI,
  "BADDR1" | "BZIP1" | "BCUST_EMAIL" | "BNAME"
>;
