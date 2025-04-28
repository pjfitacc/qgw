### Bug #1 [Fixed]

Sending Field Values to the TransQGWDB Engine with Undefined instead of just not adding those fields in the request in the first place
Our Engine is sending DirectAPI fields with values of undefined.

notice in the first Form Data (where Form Data is the request info to the Server) output below that many fields + values have value undefined:

```
Form Data: gwlogin=gwlogin&trans_method=CC&trans_type=undefined&transID=undefined&ccnum=4111111111111111&ccmo=12&ccyr=28&amount=100&BADDR1=123%20cheese%20street&BZIP1=90210&BCUST_EMAIL=transactiontequest%40email.com&override_email_customer=N&override_trans_email=N&RestrictKey=undefined&BNAME=Transaction%20Requester&CVV2=999&CVVtype=undefined&Dsep=undefined&MAXMIND=undefined

      at src/utils/transparent-qgw-db-engine.ts:135:11
```

Undefined Options Values in the request string above:

- **trans_type=undefined**
- **&transID=undefined**
- **&RestrictKey=undefined**
- **&CVVtype=undefined**
- **&Dsep=undefined**
- **&MAXMIND=undefined**

This generates an error, whereas successful requests to Quantum Gateway's Servers barely have any undefined fields:

```
Form Data: gwlogin=phimar11Dev&trans_method=CC&trans_type=CREDIT&transID=12345&ccnum=4111111111111111&ccmo=12&ccyr=99&amount=100.00&BADDR1=123%20Street&BZIP1=90210&BCUST_EMAIL=test%40example.com&override_email_customer=N&override_trans_email=N

      at src/utils/transparent-qgw-db-engine.ts:135:11

Form Data: gwlogin=phimar11Dev&trans_method=CC&trans_type=CREDIT&transID=12345&ccnum=undefined&ccmo=12&ccyr=99&amount=100.00&BADDR1=123%20Street&BZIP1=90210&BCUST_EMAIL=test%40example.com&override_email_customer=N&override_trans_email=N

      at src/utils/transparent-qgw-db-engine.ts:135:11
```

Solution:
For optional fields, whenever a field's value is undefined, don't include that field when posting to the server.

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
