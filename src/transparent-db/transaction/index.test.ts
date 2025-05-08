// Set up
// Execute
// Expect

import { Options } from "./options";
import { Payer } from "./payer";
import { ElectronicFundsTransfer, Payment } from "./payment";
import { RecurringOptions } from "./recurringOptions";
import { TransactionRequest } from "./request";

describe("TransactionRequest: Default TransQGW Options field values", () => {
  it("If TransactionRequest has blank options, the optional variables that it creates with the toAPI() method should be undefined", () => {
    const payer = new Payer("123 street", "10001", "email@email.com");
    const eft = new ElectronicFundsTransfer("123123123", "123123123123");
    const payment = new Payment(200, eft);
    const options = new Options();

    const transactionRequest = new TransactionRequest(payment, payer, options);
    const payload = transactionRequest.toAPI();

    expect(payload.override_email_customer).toBe(undefined);
    expect(payload.override_trans_email).toBe(undefined);
    expect(payload.trans_type).toBe(undefined);
    expect(payload.transID).toBe(undefined);
    expect(payload.RestrictKey).toBe(undefined);
    expect(payload.Dsep).toBe(undefined);
    expect(payload.MAXMIND).toBe(undefined);
  });

  it("If Options has emailCustomerReceipt and sendTransactionEmail true, the DirectAPI equivalent should be Y, false should be N", () => {
    const payer = new Payer("123 street", "10001", "email@email.com");
    const eft = new ElectronicFundsTransfer("123123123", "123123123123");
    const payment = new Payment(200, eft);
    const options = new Options({
      emailCustomerReceipt: true,
      sendTransactionEmail: true,
    });

    const transactionRequest = new TransactionRequest(payment, payer, options);
    const payload = transactionRequest.toAPI();

    expect(payload.override_email_customer).toBe("Y");
    expect(payload.override_trans_email).toBe("Y");
    expect(payload.trans_type).toBe(undefined);
    expect(payload.transID).toBe(undefined);
    expect(payload.RestrictKey).toBe(undefined);
    expect(payload.Dsep).toBe(undefined);
    expect(payload.MAXMIND).toBe(undefined);

    transactionRequest.options = new Options({
      emailCustomerReceipt: false,
      sendTransactionEmail: false,
    });
    const newPayload = transactionRequest.toAPI();

    expect(newPayload.override_email_customer).toBe("N");
    expect(newPayload.override_trans_email).toBe("N");
  });

  it("If Options has maxMindOn true, the DirectAPI equivalent should be 1, false should be 2", () => {
    const payer = new Payer("123 street", "10001", "email@email.com");
    const eft = new ElectronicFundsTransfer("123123123", "123123123123");
    const payment = new Payment(200, eft);
    const options = new Options({ maxMindOn: true });

    const transactionRequest = new TransactionRequest(payment, payer, options);
    const payload = transactionRequest.toAPI();

    expect(payload.MAXMIND).toBe("1");
    expect(payload.override_email_customer).toBe(undefined);
    expect(payload.override_trans_email).toBe(undefined);
    expect(payload.trans_type).toBe(undefined);
    expect(payload.transID).toBe(undefined);
    expect(payload.RestrictKey).toBe(undefined);
    expect(payload.Dsep).toBe(undefined);

    transactionRequest.options = new Options({ maxMindOn: false });
    const newPayload = transactionRequest.toAPI();

    expect(newPayload.MAXMIND).toBe("2");
  });
});

describe("TransactionRequest: Default TransQGW Recurring Options field values", () => {
  it("If TransactionRequest has recurringOptions, there MUST be a RID", () => {
    const payer = new Payer("123 street", "10001", "email@email.com");
    const eft = new ElectronicFundsTransfer("123123123", "123123123123");
    const payment = new Payment(200, eft);
    const options = new Options();

    const transactionRequest = new TransactionRequest(
      payment,
      payer,
      options,
      new RecurringOptions({ rid: "1" })
    );
    const payload = transactionRequest.toAPI();

    expect(payload.RID).toBe("1");
    expect(payload.override_recur).toBe(undefined);
    expect(payload.OverRideRecureDay).toBe(undefined);
    expect(payload.recur_times).toBe(undefined);
    expect(payload.initial_amount).toBe(undefined);
  });

  it("If RecurringOptions has overrideRecurringPrice and overrideRecurringDay true, the DirectAPI equivalent should be Y, false should be N", () => {
    const payer = new Payer("123 street", "10001", "email@email.com");
    const eft = new ElectronicFundsTransfer("123123123", "123123123123");
    const payment = new Payment(200, eft);
    const recurringOptions = new RecurringOptions({
      rid: "1",
      overrideRecurringPrice: true,
      overrideRecurringDay: true,
    });

    const transactionRequest = new TransactionRequest(
      payment,
      payer,
      undefined,
      recurringOptions
    );
    const payload = transactionRequest.toAPI();

    expect(payload.RID).toBe("1");
    expect(payload.override_recur).toBe("Y");
    expect(payload.OverRideRecureDay).toBe("Y");
    expect(payload.recur_times).toBe(undefined);
    expect(payload.initial_amount).toBe(undefined);

    transactionRequest.recurringOptions = new RecurringOptions({
      rid: "1",
      overrideRecurringPrice: false,
      overrideRecurringDay: false,
    });

    const newPayload = transactionRequest.toAPI();

    expect(newPayload.override_recur).toBe(undefined);
    expect(newPayload.OverRideRecureDay).toBe("N");
  });
});
