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
commit: 74c0c740368dcbcf93711ad87d3e78d9cb962e48

### Bug #2 [Fixed]

**Typedoc Reference exists but no Documentation error.**

**recreation**

**Error**
[warning] TransactionError, defined in qgw/src/errors/transaction-error.ts, is referenced by src.TransparentDbEngine.serverError but not included in the documentation

**Possible Solution: Change src/error/types.d.ts to src/error/type.ts**
We have a potential solution to this typedoc reference error:

      Solution:
      - https://reemus.dev/article/publishing-type-definitions-with-npm-package

      This guide mentions that if you create your own Declaration Files in your project source code, it should be a .ts instead of .d.ts, and any module that uses that type must explicitly import it instead of relying on the Typescript global namespace.
      This is because Typescript might not include the .d.ts types that you've defined during compilation.

**Actual Fix**
The above was not the solution, it was the fact that our documentation’s index.ts entry point didn’t include the module which holds TransactionError in our exports, and also we had to export the TransactionError class as a named export instead of a default export.

Git commit that fixes it: 9125d713d3102ba7a9779a5e4802ea7c1aa218ea
