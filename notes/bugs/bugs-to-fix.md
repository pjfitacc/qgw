### Bug class-transformer fromJSON

developer@developers-MacBook-Pro qgw % npm run test tests/serialization.test.ts

> qgw@1.3.0 test
> jest tests/serialization.test.ts

FAIL tests/serialization.test.ts
TransactionRequest (TR) Serialization
✕ A TR made from deserialized JSON can call TR functions (4 ms)

● TransactionRequest (TR) Serialization › A TR made from deserialized JSON can call TR functions

    TypeError: Cannot read properties of undefined (reading 'kind')

      152 |     this.method = method;
      153 |
    > 154 |     switch (method.kind) {
          |                    ^
      155 |       case "CC":
      156 |         this.directApiFields = {
      157 |           amount: amount.toString(),

      at new Payment (src/transparent-db/transaction/payment.ts:154:20)
      at TransformOperationExecutor.transform (node_modules/src/TransformOperationExecutor.ts:160:22)
      at TransformOperationExecutor.transform (node_modules/src/TransformOperationExecutor.ts:333:33)
      at ClassTransformer.plainToInstance (node_modules/src/ClassTransformer.ts:77:21)
      at plainToInstance (node_modules/src/index.ts:84:27)
      at plainToNonArrayInstance (src/utils/serialization.ts:15:35)
      at Function.fromJSON (src/transparent-db/transaction/request.ts:70:35)
      at Object.<anonymous> (tests/serialization.test.ts:10:45)

Test Suites: 1 failed, 1 total
Tests: 1 failed, 1 total
Snapshots: 0 total
Time: 0.841 s, estimated 1 s
Ran all test suites matching /tests\/serialization.test.ts/i.
developer@developers-MacBook-Pro qgw %
