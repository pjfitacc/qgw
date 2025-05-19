import "reflect-metadata";
import { TransactionError } from "../src/errors/transaction-error";
import { DirectAPI } from "../src/transparent-db/api";
import { TransparentDbEngine } from "../src/transparent-db/engine";
import { Payer } from "../src/transparent-db/transaction/payer";
import { CreditCard, Payment } from "../src/transparent-db/transaction/payment";
import { TransactionType } from "../src/transparent-db/api";
import { TransactionErrorCode } from "../src/errors/types";
import { Options } from "../src/transparent-db/transaction/options";
import { TransactionRequest } from "../src/transparent-db/transaction/request";
import { RecurringOptions } from "../src/transparent-db/transaction/recurringOptions";

async function expectEngineTransactionError(
  transaction: DirectAPI | TransactionRequest,
  expectedErrorCode: TransactionErrorCode,
  gwlogin: string = "gwlogin"
) {
  const engine = new TransparentDbEngine(gwlogin);

  await expect(engine.send(transaction)).rejects.toThrow(
    expect.objectContaining({
      code: expectedErrorCode,
    })
  );
}

// Mock data builders
const baseCC: DirectAPI = {
  gwlogin: "testLogin",
  trans_method: "CC",
  trans_type: TransactionType.CREDIT,
  transID: "12345",
  ccnum: "4111111111111111", // Visa
  ccmo: "12",
  ccyr: "99",
  amount: "100.00",
  BADDR1: "123 Street",
  BZIP1: "90210",
  BCUST_EMAIL: "test@example.com",
  override_email_customer: "N",
  override_trans_email: "N",
};

describe("TransparentQGW Db Engine", () => {
  it("sends a TransactionRequest Object and throws a TransactionError wtih code ERR_PARSE during validation due to invalid credit card number", async () => {
    const invalidPayment = new Payment(10, new CreditCard("1", "12", "41"));
    const payer = new Payer("123", "123", "email@email.com");
    const noCreditCardNumberTransaction = new TransactionRequest(
      invalidPayment,
      payer
    );

    await expectEngineTransactionError(
      noCreditCardNumberTransaction,
      "ERR_PARSE"
    );
  });

  it("sends a TransactionRequest Object with Options should be a success", async () => {
    const cc = new CreditCard("4111111111111111", "12", "28", "999");
    const payment = new Payment(100, cc);
    const payer = new Payer(
      "123 cheese street",
      "90210",
      "transactiontequest@email.com",
      "Transaction Options Tester"
    );
    const options = new Options({
      emailCustomerReceipt: false,
      sendTransactionEmail: false,
    });

    const engine = new TransparentDbEngine("phimar11Dev");

    const transactionRequest = new TransactionRequest(payment, payer, options);
    expect(engine.send(transactionRequest)).resolves.toHaveProperty(
      "result",
      "APPROVED"
    );
  });

  it("sends a TransactionRequest Object with Recurring should be a success", async () => {
    const cc = new CreditCard("4111111111111111", "12", "28", "999");
    const payment = new Payment(100, cc);
    const payer = new Payer(
      "123 recurring street",
      "90210",
      "transactiontequest@email.com",
      "Recurring Transaction Tester"
    );

    const recurringOptions = new RecurringOptions({
      rid: "1",
    });

    const engine = new TransparentDbEngine("phimar11Dev");

    const transactionRequest = new TransactionRequest(
      payment,
      payer,
      undefined,
      recurringOptions
    );
    expect(engine.send(transactionRequest)).resolves.toHaveProperty(
      "result",
      "APPROVED"
    );
  });

  it("sends a DirectAPI type and throws a TransactionError wtih code ERR_PARSE during validation due to no credit card number", async () => {
    const directApiNoCreditCardNumber: DirectAPI = {
      ...baseCC,
      ccnum: undefined,
    };

    await expectEngineTransactionError(
      directApiNoCreditCardNumber,
      "ERR_PARSE"
    );
  });

  it("send a valid Transaction", async () => {
    const engine = new TransparentDbEngine("phimar11Dev");

    expect(engine.send(baseCC)).resolves.toHaveProperty("result", "APPROVED");
  });

  it("get a server transaction error due to incorrect gateway login", async () => {
    const engine = new TransparentDbEngine("as;dlfkjas;lkj");

    await expect(engine.send(baseCC)).rejects.toThrow(TransactionError);
    await expect(engine.send(baseCC)).rejects.toThrow(
      expect.objectContaining({
        code: "ERR_SERVER_RESPONSE",
      })
    );
  });

  it("Strict Mode OFF, throws a TransactionError wtih code ERR_SERVER_DECLINED during validation due to no credit card number", async () => {
    const directApiNoCreditCardNumber: DirectAPI = {
      ...baseCC,
      ccnum: undefined,
    };

    const engine = new TransparentDbEngine("phimar11Dev");
    engine.strictMode = false;

    await expect(engine.send(directApiNoCreditCardNumber)).rejects.toThrow(
      TransactionError
    );
    await expect(engine.send(directApiNoCreditCardNumber)).rejects.toThrow(
      expect.objectContaining({
        code: "ERR_SERVER_DECLINED",
      })
    );
  });
});
