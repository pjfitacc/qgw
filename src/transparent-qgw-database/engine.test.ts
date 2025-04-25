import TransactionError from "../errors/transaction-error";
import { DirectAPI } from "./api";
import { apiSchema } from "./api/validation";
import { TransparentDbEngine } from "./engine";
import { TransactionRequest } from "./transaction-request";
import { Payer } from "./transaction-request/payer";
import { CreditCard, Payment } from "./transaction-request/payment";
import { TransactionType } from "./api";

function expectFailure(parsed: ReturnType<typeof apiSchema.safeParse>) {
  if (parsed.success) {
    console.error("❌ Expected validation failure but got success!");
    console.trace("⚠️ Unexpected success trace");
  } else {
    parsed.error.issues.forEach((issue) =>
      console.log(
        `✅ Expected failure: [${issue.path.join(".")}] ${issue.message}`
      )
    );
  }
  expect(parsed.success).toBe(false);
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
};

describe("TransparentQGW Db Engine", () => {
  it("sends a TransactionRequest Object and throws a TransactionError wtih code ERR_PARSE during validation due to invalid credit card number", () => {
    const invalidPayment = new Payment(10, new CreditCard("1", "12", "41"));
    const payer = new Payer("123", "123", "email@email.com");
    const noCreditCardNumberTransaction = new TransactionRequest(
      invalidPayment,
      payer
    );
    const engine = new TransparentDbEngine("gwlogin");

    expect(() => engine.send(noCreditCardNumberTransaction)).toThrow(
      TransactionError
    );
    expect(() => engine.send(noCreditCardNumberTransaction)).toThrow(
      expect.objectContaining({
        code: "ERR_PARSE",
      })
    );
  });

  it("sends a DirectAPI type and throws a TransactionError wtih code ERR_PARSE during validation due to no credit card number", () => {
    const directApiNoCreditCardNumber: DirectAPI = {
      ...baseCC,
      ccnum: undefined,
    };

    const engine = new TransparentDbEngine("gwlogin");

    expect(() => engine.send(directApiNoCreditCardNumber)).toThrow(
      TransactionError
    );
    expect(() => engine.send(directApiNoCreditCardNumber)).toThrow(
      expect.objectContaining({
        code: "ERR_PARSE",
      })
    );
  });

  it("sends a DirectAPI type and throws a TransactionError wtih code ERR_PARSE during validation due to no credit card number", () => {
    const directApiNoCreditCardNumber: DirectAPI = {
      ...baseCC,
      ccnum: undefined,
    };

    const engine = new TransparentDbEngine("gwlogin");

    expect(() => engine.send(directApiNoCreditCardNumber)).toThrow(
      TransactionError
    );
    expect(() => engine.send(directApiNoCreditCardNumber)).toThrow(
      expect.objectContaining({
        code: "ERR_PARSE",
      })
    );
  });
});
