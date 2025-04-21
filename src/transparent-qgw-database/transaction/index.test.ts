// Set up
// Execute
// Expect

import { TransactionRequest } from ".";
import { Options } from "./options";
import { Payer } from "./payer";
import { ElectronicFundsTransfer, Payment } from "./payment";

describe("TransactionRequest: Default TransQGW Options field values", () => {
  it("If TransactionRequest has blank options, the optional variables that it creates with the toAPI() method should be undefined", () => {
    const payer = new Payer("123 street", "10001", "email@email.com");
    const eft = new ElectronicFundsTransfer("123123123", "123123123123");
    const payment = new Payment(200, eft);
    const options = new Options();

    const transactionRequest = new TransactionRequest(payment, payer, options);
    const payload = transactionRequest.toAPI();

    expect(payload.override_email_customer).toBe(undefined);
    expect(payload.override_trans_email).toBe(undefined);
    expect(payload.trans_type).toBe(undefined);
    expect(payload.transID).toBe(undefined);
    expect(payload.RestrictKey).toBe(undefined);
    expect(payload.Dsep).toBe(undefined);
    expect(payload.MAXMIND).toBe(undefined);
  });
});
