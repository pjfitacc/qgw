import { ZodError } from "zod";
import { transactionRequest } from "../data/mock/quantum-gateway";
import {
  ElectronicFundsTransfer,
  Payment,
  TransactionRequest,
} from "../src/transparent-db";

describe("TransactionRequest (TR) Serialization", () => {
  it("A TR made from deserialized JSON can call TR functions", () => {
    const transaction = transactionRequest;
    const originalDirectApi = transactionRequest.toAPI();

    const serialized = transaction.toJSON();
    const deserialized = TransactionRequest.fromJSON(serialized);

    expect(deserialized.toAPI()).toEqual(originalDirectApi);
  });

  it("Should throw a Zod error if the TransactionRequest JSON doesn't have a payment.", () => {
    const transaction = {
      payer: {
        address: "123 street",
        zip: "90210",
        email: "azure@email.com",
        name: "Azure Functions",
      },
      options: {
        optionsFields: {
          emailCustomerReceipt: false,
          sendTransactionEmail: false,
          transactionType: undefined,
          transactionID: undefined,
          restrictKey: undefined,
          dataSeparator: undefined,
          maxMindOn: undefined,
        },
      },
      recurringOptions: undefined,
    };

    const serialized = JSON.stringify(transaction);
    expect(() => TransactionRequest.fromJSON(serialized)).toThrow(ZodError);
  });

  it("A TR with an EFT payment type made from deserialized JSON can call TR functions", () => {
    const transaction = transactionRequest;
    const payment = new Payment(2, new ElectronicFundsTransfer("1231", "123"));
    transaction.payment = payment;
    const originalDirectApi = transactionRequest.toAPI();

    const serialized = transaction.toJSON();
    const deserialized = TransactionRequest.fromJSON(serialized);

    expect(deserialized.toAPI()).toEqual(originalDirectApi);
    expect(deserialized.payment.isElectronicFundsTransfer());
  });
});
