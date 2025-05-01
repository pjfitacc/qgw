### Library Version 1 Construct Categorization

This md document notes the list all of the library constructs we created and displayed in the [Library's Version 1 UML Diagram](../public/assets/Version%201%20UML%20diagram.svg)

`Note: Constructs in this case represent Typescript types, enums, interfaces, classes.`

Additionally, we categorize these constructs based on two criteria:

1. _visibility_ - public or private interface available to the
2. _entry point_ - this qgw package has two entry points:
   a. "qgw"
   b. "qgw/transparent-db"

**Public Visibility Constructs**

- [x] DirectAPI

  - [x] TransactionType

- [x] TransactionRequest

  - [x] Payer
    - [x] Payment
      - [x] CreditCard
        - [x] CvvType
      - [x] ElectronicFundsTransfer
  - [x] Options
    - [x] OptionsFields
  - [x] RecurringOptions
    - [x] RecurringOptionsFields

- [x] TransactionResponse

- [x] TransparentDbEngine
  - [x] TransactionError
    - [x] TransactionDeclinedIssue

**Private Visibility Constructs**

- [x] ServerResponseFieldIndexes
- [x] HttpClientConfig
- [x] CustomError
  - [x] CustomIssue

**Construct/Object Package Entry Point Categorization**

- CustomError and Custom Issue belong to the main entry point "." aka "qgw"
- All other classes in this document belong to the "qgw/transparent-db" package entry point.
