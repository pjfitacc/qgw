import { DirectAPI } from "..";

// Payer Class:
// - address: BADDR1
// - zip: BZIP1
// - email: BCUST_EMAIL
// - name: BNAME

export class Payer {
  public fields: PayerFields;
  constructor(
    public address: string,
    public zip: string,
    public email: string,
    public name?: string
  ) {
    this.fields = {
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
