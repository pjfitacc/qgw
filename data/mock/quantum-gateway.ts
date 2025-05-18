import {
  CreditCard,
  Payment,
  Payer,
  TransactionRequest,
  Options,
} from "../../src/transparent-db";

// Quantum Gateway Dummy Data
export const quantumGatewayLogin = "phimar11Dev";

// Customer Dummy Data
const paymentAmount = 16;

const ccNumber = "4111111111111111";
const ccExpMonth = "12";
const ccExpYear = "28";
const cvv = "999";

const street = "123 street";
const zip = "90210";
const email = "azure@email.com";
const name = "Azure Functions";

// Create a Credit Card
const creditCard = new CreditCard(ccNumber, ccExpMonth, ccExpYear, cvv);

// Create a Payment object that specifies an amount to pay and a payment type object, in this case, a credit card.
const payment = new Payment(paymentAmount, creditCard);
const payer = new Payer(street, zip, email, name);

// Additional Options that the Quantum Gateway Transparent Database Engine accepts per transaction.
const options = new Options({
  emailCustomerReceipt: false,
  sendTransactionEmail: false,
});

export const transactionRequest = new TransactionRequest(
  payment,
  payer,
  options
);
