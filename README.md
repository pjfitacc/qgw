## Quantum Gateway Library (qgw)

#### Description

This library offers Javascript modules and functionality into the [Quantum Gateway Integration APIs](https://www.quantumgateway.com/developer.php). This is a third party library; the author does not work for Quantum Gateway.

#### Supported APIs

- [Transparent QGWdatabase Engine](https://www.quantumgateway.com/view_developer.php?Cat1=3)

#### Transparent QGWdatabase Engine Library API

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
const paymentAmount = 19;

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

#### Contributions

The features prioritized are based on the author's Quantum Gateway integration needs. If you wish to help out, send a pull request, or if you want to talk in further detail, contact the author through their email in the [Contact](#contact) section.

#### Contact

**Author**: PJF Developer

**Contact email**: pjfitacc@gmail.com
