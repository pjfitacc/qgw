import { transactionRequest } from "../data/mock/quantum-gateway";
import { TransactionRequest } from "../src/transparent-db";

describe("TransactionRequest (TR) Serialization", () => {
  it("A TR made from deserialized JSON can call TR functions", () => {
    const transaction = transactionRequest;
    const originalDirectApi = transactionRequest.toAPI();

    const serialized = transaction.toJSON();
    const deserialized = TransactionRequest.fromJSON(serialized);

    expect(deserialized.toAPI()).toEqual(originalDirectApi);
  });
});
