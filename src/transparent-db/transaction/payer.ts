import { Expose, plainToInstance, instanceToPlain } from "class-transformer";
import { DirectAPI } from "../api";
import { plainToNonArrayInstance } from "../../utils/serialization";

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
  /** @hidden */
  public directApiFields: PayerFields;

  @Expose()
  address!: string;

  @Expose()
  zip!: string;

  @Expose()
  email!: string;

  @Expose()
  name!: string;

  /**
   *
   * @param address - The billing address.
   * @param zip - The billing zip code.
   * @param email - The billing's contact email address.
   * @param name - The billing contact's name.
   */
  constructor(
    address: string,
    zip: string,
    email: string,
    name: string = "anonymous"
  ) {
    this.address = address;
    this.zip = zip;
    this.email = email;
    this.name = name;

    this.directApiFields = {
      BADDR1: address,
      BZIP1: zip,
      BCUST_EMAIL: email,
      BNAME: name,
    };
  }

  static fromJSON(json: any): Payer {
    return plainToNonArrayInstance(Payer, json);
  }

  toJSON(): any {
    return instanceToPlain(this);
  }
}

export type PayerFields = Pick<
  DirectAPI,
  "BADDR1" | "BZIP1" | "BCUST_EMAIL" | "BNAME"
>;
