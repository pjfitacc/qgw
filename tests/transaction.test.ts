import { BillingInfo } from "../src/billing";
import { CreditCard } from "../src/payment";
import {
  TransactionOptions,
  TransactionType,
  Transaction,
} from "../src/Transaction";

describe("Transaction JSON Conversion", () => {
  it("should convert Transaction to JSON and back and be equal", () => {
    const billingInfo: BillingInfo = {
      BADDR1: "123 Main St",
      BZIP1: "90210",
      BCUST_EMAIL: "test@example.com",
      BNAME: "John Doe",
    };

    const payment: CreditCard = {
      trans_method: "CC",
      ccnum: "4111111111111111",
      ccmo: "12",
      ccyr: "2030",
      CVV2: "123",
      CVVtype: "Visa",
    };

    const transactionOptions: TransactionOptions = {
      trans_type: TransactionType.AUTH_CAPTURE,
      transID: "abc123",
      RestrictKey: "rk456",
      Dsep: "|",
      MAXMIND: "1",
      override_email_customer: "N",
      override_trans_email: "Y",
    };

    const transaction = new Transaction(
      100.0,
      billingInfo,
      payment,
      transactionOptions,
      {}
    );

    const json = JSON.stringify(transaction);
    const parsed = JSON.parse(json) as Transaction;

    expect(parsed).toEqual(transaction);
  });
});
