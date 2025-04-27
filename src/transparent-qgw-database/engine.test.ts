import TransactionError from "../errors/transaction-error";
import { DirectAPI } from "./api";
import { TransparentDbEngine } from "./engine";
import { TransactionRequest, TransactionResponse } from "./transaction";
import { Payer } from "./transaction/payer";
import { CreditCard, Payment } from "./transaction/payment";
import { TransactionType } from "./api";

async function expectEngineTransactionError(
  transaction: DirectAPI | TransactionRequest,
  expectedErrorCode: TransactionErrorCode
) {
  const engine = new TransparentDbEngine("gwlogin");

  await expect(engine.send(transaction)).rejects.toThrow(TransactionError);
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
});
