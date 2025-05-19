import "reflect-metadata";
import { Payer } from "../src/transparent-db/transaction/payer";
import {
  CreditCard,
  CvvType,
  Payment,
} from "../src/transparent-db/transaction/payment";
import { TransactionRequest } from "../src/transparent-db/transaction/request";
import { apiSchema } from "../src/transparent-db/validation/api";
import { transactionRequestSchema } from "../src/transparent-db/validation/transactionRequest";

// Zod helpers for clean debugging
function expectZodSuccess(parsed: ReturnType<typeof apiSchema.safeParse>) {
  if (!parsed.success) {
    console.error("❌ Zod validation failed:");
    parsed.error.issues.forEach((issue) =>
      console.error(`→ [${issue.path.join(".")}] ${issue.message}`)
    );
    console.trace("🔍 Stack trace");
  }
  expect(parsed.success).toBe(true);
}

function expectZodFailure(parsed: ReturnType<typeof apiSchema.safeParse>) {
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
const baseCC = {
  gwlogin: "testLogin",
  trans_method: "CC",
  trans_type: "SALE",
  transID: "12345",
  ccnum: "4111111111111111", // Visa
  ccmo: "12",
  ccyr: "99",
  amount: "100.00",
  BADDR1: "123 Street",
  BZIP1: "90210",
  BCUST_EMAIL: "test@example.com",
};

const baseEFT = {
  gwlogin: "testLogin",
  trans_method: "EFT",
  trans_type: "CREDIT",
  transID: "12345",
  aba: "123456789",
  checkacct: "987654321",
  amount: "100.00",
  BADDR1: "123 Street",
  BZIP1: "90210",
  BCUST_EMAIL: "test@example.com",
};

describe("apiSchema validation", () => {
  it("accepts valid CC input", () => {
    const parsed = apiSchema.safeParse(baseCC);
    expectZodSuccess(parsed);
  });

  it("rejects missing ccnum when trans_method is CC", () => {
    const parsed = apiSchema.safeParse({ ...baseCC, ccnum: undefined });
    expectZodFailure(parsed);
  });

  it("rejects missing ccmo when trans_method is CC", () => {
    const parsed = apiSchema.safeParse({ ...baseCC, ccmo: undefined });
    expectZodFailure(parsed);
  });

  it("rejects expired card (past month)", () => {
    const expired = { ...baseCC, ccmo: "01", ccyr: "20" }; // assuming year < 2025
    const parsed = apiSchema.safeParse(expired);
    expectZodFailure(parsed);
  });

  it("accepts valid EFT input", () => {
    const parsed = apiSchema.safeParse(baseEFT);
    expectZodSuccess(parsed);
  });

  it("rejects missing aba for EFT", () => {
    const parsed = apiSchema.safeParse({ ...baseEFT, aba: undefined });
    expectZodFailure(parsed);
  });

  it("rejects missing checkacct for EFT", () => {
    const parsed = apiSchema.safeParse({ ...baseEFT, checkacct: undefined });
    expectZodFailure(parsed);
  });

  it("rejects 0 amount", () => {
    const parsed = apiSchema.safeParse({ ...baseCC, amount: "0" });
    expectZodFailure(parsed);
  });

  it("rejects invalid email", () => {
    const parsed = apiSchema.safeParse({
      ...baseCC,
      BCUST_EMAIL: "not-an-email",
    });
    expectZodFailure(parsed);
  });

  it("rejects invalid card number format", () => {
    const parsed = apiSchema.safeParse({
      ...baseCC,
      ccnum: "1234567890123456",
    });
    expectZodFailure(parsed);
  });

  it("accepts Amex and validates CVV2 length = 4", () => {
    const amex = {
      ...baseCC,
      ccnum: "378282246310005", // Amex
      CVV2: "1234",
    };
    const parsed = apiSchema.safeParse(amex);
    expectZodSuccess(parsed);
  });

  it("rejects Amex with 3-digit CVV2", () => {
    const amex = {
      ...baseCC,
      ccnum: "378282246310005",
      CVV2: "123",
    };
    const parsed = apiSchema.safeParse(amex);
    expectZodFailure(parsed);
  });

  it("rejects Visa with 4-digit CVV2", () => {
    const visa = {
      ...baseCC,
      ccnum: "4111111111111111",
      CVV2: "1234",
    };
    const parsed = apiSchema.safeParse(visa);
    expectZodFailure(parsed);
  });

  it("rejects recur_times if not numeric", () => {
    const parsed = apiSchema.safeParse({ ...baseCC, recur_times: "abc" });
    expectZodFailure(parsed);
  });

  it("rejects recur_times < 0", () => {
    const parsed = apiSchema.safeParse({ ...baseCC, recur_times: "-5" });
    expectZodFailure(parsed);
  });

  it("accepts recur_times >= 0", () => {
    const parsed = apiSchema.safeParse({ ...baseCC, recur_times: "0" });
    expectZodSuccess(parsed);
  });
});

describe("transactionRequestSchema validation", () => {
  it("accepts basic Credit Card TransactionRequest object", () => {
    const creditCard = new CreditCard(
      "123123123123",
      "02",
      "21",
      "123",
      CvvType["Not Passing CVV2"]
    );
    const payment = new Payment(10, creditCard);
    const payer = new Payer("123", "123", "email@email.com");
    const transationRequest = new TransactionRequest(payment, payer);

    const parsed = transactionRequestSchema.safeParse(transationRequest);

    expect(parsed.success).toBe(true);
  });

  it("should throw an error for invalid email", () => {
    const creditCard = new CreditCard(
      "123123123123",
      "02",
      "21",
      "123",
      CvvType["Not Passing CVV2"]
    );
    const payment = new Payment(10, creditCard);
    const payer = new Payer("123", "123", "123email");
    const transationRequest = new TransactionRequest(payment, payer);

    const parsed = transactionRequestSchema.safeParse(transationRequest);

    expect(parsed.success).toBe(false);
    // TODO: What kind of error field and message should we be expecting on any of the TransactionRequests?
    // Should there be some standard error format?
  });
});
