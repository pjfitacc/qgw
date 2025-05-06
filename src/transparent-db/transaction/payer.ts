import { DirectAPI } from "../api";

/**
 * ### Description
 *  TransactionRequest requires a Payer object that provides information about the customer.
 *
 * @privateRemarks
 *  Payer Class fields to DirectAPI mapping:
 *  - address: BADDR1
 *  - zip: BZIP1
 *  - email: BCUST_EMAIL
 *  - name: BNAME
 *
 */
export class Payer {
  public directApiFields: PayerFields;
  /**
   *
   * @param address - The billing address.
   * @param zip - The billing zip code.
   * @param email - The billing's contact email address.
   * @param name - The billing contact's name.
   */
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
