import { TransparentDatabaseEngine } from "../..";
import { Transaction, TransactionType } from "../../transaction";
import { mapTransactionToPayload } from "../flattener";

describe("mapTransactionToPayload", () => {
  it("maps a transaction with credit card payment correctly", () => {
    const transaction = new Transaction(
      150.5,
      {
        address: "123 Billing St",
        zip: "12345",
        email: "test@example.com",
        name: "John Doe",
      },
      {
        method: "CREDIT_CARD",
        number: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "2025",
        cvv2: "123",
        cvvType: "VISA",
      },
      {
        transactionType: TransactionType.SALES,
        transactionID: "TX123",
        restrictKey: "RK001",
        dataSeparator: "|",
        maxMindOn: true,
        emailCustomerReceipt: true,
        sendTransactionEmail: false,
      },
      {
        overrideRecurringPrice: true,
        rid: "RECUR123",
        initialAmount: 20,
        recurCycles: 3,
        overrideRecurringDay: false,
      }
    );

    const payload = mapTransactionToPayload(transaction);

    expect(payload).toEqual({
      gwlogin: TransparentDatabaseEngine.postURL,
      trans_method: "CC",
      trans_type: TransactionType.SALES,
      amount: "150.5",
      BADDR1: "123 Billing St",
      BZIP1: "12345",
      BCUST_EMAIL: "test@example.com",
      BNAME: "John Doe",
      ccnum: "4111111111111111",
      ccmo: "12",
      ccyr: "2025",
      CVV2: "123",
      CVVtype: "VISA",
      transID: "TX123",
      RestrictKey: "RK001",
      Dsep: "|",
      MAXMIND: "1",
      override_email_customer: "Y",
      override_trans_email: "N",
      override_recur: "Y",
      RID: "RECUR123",
      initial_amount: "20",
      recur_times: "3",
      OverRideRecureDay: "N",
    });
  });

  it("maps a transaction with EFT payment correctly", () => {
    const transaction = new Transaction(
      89.99,
      {
        address: "789 Payment Rd",
        zip: "54321",
        email: "eft@example.com",
      },
      {
        method: "EFT",
        aba: "011000015",
        checkingAccountNumber: "9876543210",
      },
      {
        transactionType: TransactionType.AUTH_ONLY,
        emailCustomerReceipt: false,
        sendTransactionEmail: true,
      }
    );

    const payload = mapTransactionToPayload(transaction);

    expect(payload).toEqual({
      gwlogin: TransparentDatabaseEngine.postURL,
      trans_method: "EFT",
      trans_type: TransactionType.AUTH_ONLY,
      amount: "89.99",
      BADDR1: "789 Payment Rd",
      BZIP1: "54321",
      BCUST_EMAIL: "eft@example.com",
      aba: "011000015",
      checkacct: "9876543210",
      transID: "",
      RestrictKey: "",
      Dsep: "",
      MAXMIND: "2",
      override_email_customer: "N",
      override_trans_email: "Y",
    });
  });
});
