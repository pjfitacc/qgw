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

#### Solution: Separate class construction from DirectAPI construction. Separate Data Layout from Functionality.

It originates when we first call fromJSON from the TransactionRequest Object.

fromJSON will create instances of TransactionRequest's classes fields: payment, payer, options, recurringoptions.

When these classes are instantiated, we call its empty constructor. ex: new Payment().
Since our classes don't have a no arg constructor, for some reason, it defaults to our constructor with arguments.

So we call our payment constructor that relies on args, but no arguments are provided, then an undefined issue arises.

We need a class redesign.

When constructing our TransactionRequest subclasses, do not introduce conditional functionality that would require the existence of some parameter, value to exist.

For our cases, it just means that for the classes:

- Options
- Payer
- Payment
- RecurringOptions

we don't do any mapping from the Class's native fields to their corresponding DirectAPI fields.

For example in Payer:
constructor(
address: string,
zip: string,
email: string,
name: string = "anonymous"
) {
this.address = address;
this.zip = zip;
this.email = email;
this.name = name;

    this.directApiFields = {
      BADDR1: address,
      BZIP1: zip,
      BCUST_EMAIL: email,
      BNAME: name,
    };

}

The constructor should not be mapping its data values to this.directApiFields.
Because this mapping is considered conditional functionality.

We have to move directApiFields to its own method that can be called later AFTER the data construction is set.

TODO:

- [x] Make an interface: Mappable

These classes will implement Mappable to type DirectAPI:

Todo:

- [x] Options
- [x] Payer
- [x] Payment
- [x] RecurringOptions
