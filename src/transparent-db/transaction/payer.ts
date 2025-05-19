import { Expose, instanceToPlain } from "class-transformer";
import { DirectAPI } from "../api";
import { plainToNonArrayInstance } from "../../utils/serialization";
import { KeyMappable } from "../../utils/mapping";

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
export class Payer implements KeyMappable<DirectAPI, PayerDirectApiFields> {
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
  }

  /**
   * @hidden
   */
  toPartial(): Pick<DirectAPI, PayerDirectApiFields> {
    return {
      BADDR1: this.address,
      BZIP1: this.zip,
      BCUST_EMAIL: this.email,
      BNAME: this.name,
    };
  }

  static fromJSON(json: unknown): Payer {
    return plainToNonArrayInstance(Payer, json);
  }

  toJSON(): unknown {
    return instanceToPlain(this);
  }
}

/**
 * @ignore
 */
export type PayerDirectApiFields = "BADDR1" | "BZIP1" | "BCUST_EMAIL" | "BNAME";
