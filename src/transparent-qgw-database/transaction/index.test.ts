// Set up
// Execute
// Expect

import { TransactionRequest } from ".";
import { Payer } from "./payer";
import { ElectronicFundsTransfer, Payment } from "./payment";

describe("Default TransQGW Options field values", () => {
  it("Should have override_email_customer and override_trans_email set to Y, even if TransactionRequest did not take options", () => {
    const payer = new Payer("123 street", "10001", "email@email.com");
    const payment = new Payment(
      200,
      new ElectronicFundsTransfer("123123123", "123123123123")
    );
    const transactionRequest = new TransactionRequest(payment, payer);
    const payload = transactionRequest.convertToPayload();

    expect(payload.override_email_customer).toBe("Y");
    expect(payload.override_trans_email).toBe("Y");
  });
});
