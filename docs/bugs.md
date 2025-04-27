Bug #1 Sending Field Values to the TransQGWDB Engine with Undefined instead of just not adding those fields in the request in the first place
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
