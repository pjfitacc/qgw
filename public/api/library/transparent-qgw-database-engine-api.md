## Transparent QGWdatabase Engine Library API

---

Read the [Official API](https://www.quantumgateway.com/view_developer.php?Cat1=3) that this library is based off of.

#### Example Usage

```javascript
import {
  CreditCard,
  Options,
  Payer,
  Payment,
  TransactionRequest,
  TransparentDbEngine,
} from "qgw";

// Quantum Gateway Dummy Data
const myQuantumGatewayLogin = "gwlogin";

// Customer Dummy Data
const paymentAmount = 19.95;

const ccNumber = "4111111111111111";
const ccExpMonth = "12";
const ccExpYear = "28";
const cvv = "999";

const street = "123 street";
const zip = "90210";
const email = "jane@email.com";
const name = "Jane Doe";

/**
 * Library Usage Starts Here
 **/

// Create an Engine Object to talk with the Quantum Gateway servers hosting the Transparent Database Engine
const engine = new TransparentDbEngine(myQuantumGatewayLogin);

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

const transactionRequest = new TransactionRequest(payment, payer, options);

// A transaction to Quantum Gateway's Engine is initiated once the engine object calls the send method.
engine.send(transactionRequest);
```

#### Diagrams

##### Transparent Quantum Gateway Library UML

<figure>    
    <img src="../../assets/Version 1 UML diagram.svg">
    <figcaption>Diagram made with <a href="https://github.com/demike/TsUML2">TsUML2</a></figcaption>
</figure>

##### TransparentDbEngine Class Functions Flow Diagram

<figure>    
    <img src="../../assets/TransactionDbEngine functions flowchart.svg">
    <figcaption>Diagram made with <a href="https://lucid.app/lucidchart/6b600307-6ca9-4481-972b-ceff31ac10ee/edit?viewport_loc=-745%2C-375%2C6821%2C3927%2C0_0&invitationId=inv_45e8b426-b684-40e5-8ddc-1a0bf6871fc3">LucidChart</a></figcaption>
</figure>
