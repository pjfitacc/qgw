import { BillingInfo, CreditCard } from "../src/payment";
import {
  TransactionOptions,
  TransactionType,
  Transaction,
} from "../src/transaction";

describe("Transaction JSON Conversion", () => {
  it("should convert Transaction to JSON and back and be equal", () => {
    const billingInfo: BillingInfo = {
      address: "123 Main St",
      zip: "90210",
      email: "test@example.com",
      name: "John Doe",
    };

    const payment: CreditCard = {
      method: "CREDIT_CARD",
      number: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "2030",
      cvv2: "123",
      cvvType: "Visa",
    };

    const transactionOptions: TransactionOptions = {
      transactionType: TransactionType.AUTH_CAPTURE,
      transactionID: "abc123",
      restrictKey: "rk456",
      dataSeparator: "|",
      maxMindOn: true,
      emailCustomerReceipt: false,
      sendTransactionEmail: true,
    };

    const transaction = new Transaction(
      100.0,
      billingInfo,
      payment,
      transactionOptions
    );

    const json = JSON.stringify(transaction);
    const parsed = JSON.parse(json) as Transaction;

    expect(parsed).toEqual(transaction);
  });
});
