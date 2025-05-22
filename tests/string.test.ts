import {
  TransactionDeclinedIssue,
  TransactionError,
  TransactionResponse,
} from "../src/transparent-db";

describe("TransactionResponse.toString()", () => {
  it("should include all fields for APPROVED transactions", () => {
    const approvedResponse = new TransactionResponse([
      "APPROVED",
      "AUTH123",
      "TRANS456",
      "AVR123",
      "M",
      "0.5",
      "5454",
      "VISA",
    ]);

    const result = approvedResponse.toString();
    expect(result).toContain("result: APPROVED");
    expect(result).toContain("authCode: AUTH123");
    expect(result).toContain("transID: TRANS456");
    expect(result).toContain("last4Digits: 5454");
    expect(result).toContain("creditCardProvider: VISA");
    expect(result).not.toContain("declineReason");
    expect(result).not.toContain("errorCode");
  });

  it("should include decline fields for DECLINED transactions", () => {
    const declinedResponse = new TransactionResponse([
      "DECLINED",
      "AUTH123",
      "TRANS456",
      "AVR123",
      "N",
      "0.5",
      "Insufficient funds",
      "201",
    ]);

    const result = declinedResponse.toString();
    expect(result).toContain("result: DECLINED");
    expect(result).toContain("declineReason: Insufficient funds");
    expect(result).toContain("errorCode: 201");
    expect(result).not.toContain("last4Digits");
    expect(result).not.toContain("creditCardProvider");
  });

  it("should handle empty fields gracefully", () => {
    const emptyResponse = new TransactionResponse([
      "APPROVED",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    const result = emptyResponse.toString();
    expect(result).toContain("authCode: ");
    expect(result).toContain("transID: ");
  });
});

describe("TransactionError.toString()", () => {
  it("should format basic error with simple issues", () => {
    const error = new TransactionError({
      message: "Validation failed",
      code: "ERR_PARSE",
      issues: [
        {
          code: "invalid_type",
          message: "Expected number",
          path: ["amount"],
        },
      ],
    });

    const result = error.toString();
    expect(result).toContain("code: ERR_PARSE");
    expect(result).toContain('message: "Validation failed"');
    expect(result).toContain("invalid_type");
    expect(result).toContain("path: [amount]");
  });

  it("should include serverResponse for declined transactions", () => {
    const declinedResponse = new TransactionResponse([
      "DECLINED",
      "AUTH123",
      "TRANS456",
      "AVR123",
      "N",
      "0.5",
      "Insufficient funds",
      "201",
    ]);

    const error = new TransactionError({
      message: "Transaction declined",
      code: "ERR_SERVER_DECLINED",
      issues: [
        {
          code: "auth_declined",
          message: "Authorization declined",
          serverResponse: declinedResponse,
        } as TransactionDeclinedIssue,
      ],
    });

    const result = error.toString();
    expect(result).toContain("code: ERR_SERVER_DECLINED");
    expect(result).toContain("serverResponse: TransactionResponse");
    expect(result).toContain("result: DECLINED");
    expect(result).toContain("declineReason: Insufficient funds");
  });

  it("should handle multiple issues", () => {
    const error = new TransactionError({
      message: "Multiple errors",
      issues: [
        { code: "error1", message: "First error" },
        { code: "error2", message: "Second error", path: ["field"] },
      ],
    });

    const result = error.toString();
    expect(result).toContain("First error");
    expect(result).toContain("Second error");
    expect(result).toContain("path: [field]");
  });

  it("should handle error without code", () => {
    const error = new TransactionError({
      message: "Unknown error",
      issues: [],
    });

    const result = error.toString();
    expect(result).toContain("code: undefined");
    expect(result).toContain('message: "Unknown error"');
    expect(result).toContain("issues: []");
  });
});
