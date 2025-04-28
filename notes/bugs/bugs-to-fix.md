### Bug #2

Sending a TransactionRequest that contains a Payment amount that is a Non Integer / Float gives a quantum gateway server error.

#### Bug Recreation

Setup Code:

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
const myQuantumGatewayLogin = "phimar11Dev";

// Customer Dummy Data
const ccNumber = "4111111111111111";
const ccExpMonth = "12";
const ccExpYear = "28";
const cvv = "999";

const street = "123 street";
const zip = "90210";
const email = "jane@email.com";
const name = "Jane Doe";

const options = new Options({
  emailCustomerReceipt: false,
  sendTransactionEmail: false,
});
```

**Bug Starts here**

```javascript
// ** BUG EXISTS HERE WHEN THE PAYMENT AMOUNT IS SET TO A FLOAT **
const paymentAmount = 19.99;
// ** BUG **
```

Sending a TransparentDbEngine Request with a TransacitonRequest Object

```javascript
/**
 * TransactionRequest Sending the Erroneous payment amount
 **/

// Create an Engine Object to talk with the Quantum Gateway servers hosting the Transparent Database Engine
const engine = new TransparentDbEngine(myQuantumGatewayLogin);

// Create a Credit Card
const creditCard = new CreditCard(ccNumber, ccExpMonth, ccExpYear, cvv);

const payment = new Payment(paymentAmount, creditCard);
const payer = new Payer(street, zip, email, name);

const transactionRequest = new TransactionRequest(payment, payer, options);

engine.send(transactionRequest);
```

The Error also happens when we provide the Engine with the DirectAPI:

```javascript
// Same constants from Setup Code above
const directAPI: DirectAPI = {
  gwlogin: myQuantumGatewayLogin,
  amount: paymentAmount.toString(),
  ccnum: ccNumber,
  ccmo: ccExpMonth,
  ccyr: ccExpYear,
  BNAME: "DirectAPI Test",
};

engine.strictMode = false;
engine.send(directAPI);
```

Error when we send this engine transaction:

```
npx ts-node src/index
/Users/user1/projects/qgw-test-consumer/node_modules/qgw/src/transparent-qgw-database/engine.ts:95
    throw new TransactionError({
          ^
TransactionError: Error Error - Retry
    at TransparentDbEngine.serverError (/Users/user1/projects/qgw-test-consumer/node_modules/qgw/src/transparent-qgw-database/engine.ts:95:11)
    at TransparentDbEngine.<anonymous> (/Users/user1/projects/qgw-test-consumer/node_modules/qgw/src/transparent-qgw-database/engine.ts:65:18)
    at Generator.throw (<anonymous>)
    at rejected (/Users/user1/projects/qgw-test-consumer/node_modules/qgw/dist/index.js:40:29)
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_SERVER_DECLINED',
  issues: [
    {
      message: 'Error Error - Retry',
      code: '299',
      serverResponse: [TransactionResponse]
    }
  ]
}
```
