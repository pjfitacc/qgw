Mapping:

Class Field Path | DirectAPI Key | Type | Optional?
payment.amount | amount | string (converted from number) | No
payment.method.kind | trans_method | "CC" | "EFT" | Yes
payment.method.number (CC) | ccnum | string | Yes
payment.method.expirationMonth (CC) | ccmo | string | Yes
payment.method.expirationYear (CC) | ccyr | string | Yes
payment.method.cvv2 (CC) | CVV2 | string | Yes
payment.method.cvvType (CC) | CVVtype | "0" | "1" | "2" | "9" | Yes
payment.method.aba (EFT) | aba | string | Yes
payment.method.checkingAccountNumber(EFT) | checkacct | string | Yes
payer.address | BADDR1 | string | No
payer.zip | BZIP1 | string | No
payer.email | BCUST_EMAIL | string | No
payer.name | BNAME | string | Yes
options.emailCustomerReceipt | override_email_customer | "Y" | "N" | No
options.sendTransactionEmail | override_trans_email | "Y" | "N" | No
options.transactionType | trans_type | TransactionType enum | Yes
options.transactionID | transID | string | Yes
options.restrictKey | RestrictKey | string | Yes
options.dataSeparator | Dsep | string | Yes
options.maxMindOn | MAXMIND | "1" | "2" | Yes
recurringOptions.rid | RID | string | No (if present)
recurringOptions.overrideRecurringPrice | override_recur | "Y" | "N" | Yes
recurringOptions.initialAmount | initial_amount | string (from number) | Yes
recurringOptions.recurCycles | recur_times | string (from number) | No
recurringOptions.overrideRecurringDay | OverRideRecureDay | "Y" | "N" | Yes

Mapping Checklist:

- [ ] variable name (case sensitive)
- [ ] variable type
- [ ] variable optionality: ? = optional, no ? = required
- [ ] variable hierarchy position = ex: hierarchical.object.variableA vs. variableB

DirectAPI => TransactionRequest:

- [x] gwlogin: string => UNDEFINED
- [x] trans_method?: "CC" | "EFT" => "CC" if Payment method is CreditCard type | or "EFT" if Payment method is ElectronicFundsTransfer type
- [x] trans_type?: TransactionType => options.transactionType?: TransactionType
- [x] transID?: string => options.transactionID?: string
- [x] ccnum?: string
      => if payment.method.kind === "CC"
      => payment.method.number: string
- [x] ccmo?: string
      => if payment.method.kind === "CC"
      => payment.method.expirationMonth: string
- [x] ccyr?: string
      => if payment.method.kind === "CC"
      => payment.method.expirationYear: string
- [x] aba?: string
      => if payment.method.kind === "EFT"
      => payment.method.aba: string
- [x] checkacct?: string
      => if payment.method.kind === "EFT"
      => payment.method.checkingAccountNumber: string
- [x] amount: string => payment.amount: number
- [x] BADDR1: string => payer.address: string
- [x] BZIP1: string => payer.zip: string
- [x] BCUST_EMAIL: string => payer.email: string
- [x] override_email_customer: "Y" | "N" => options.emailCustomerReceipt: boolean = true
- [x] override_trans_email: "Y" | "N" => options.sendTransactionEmail: boolean = true
- [x] RestrictKey?: string => options.restrictKey?: string
- [x] BNAME?: string => payer.name: string = "anonymous"
- [x] CVV2?: string
      => if payment.method.kind === "CC"
      => payment.method.cvv2?: string
- [x] CVVtype?: "0" | "1" | "2" | "9"
      => if payment.method.kind === "CC"
      => payment.method.cvvType?: CvvType
- [x] Dsep?: string => options.dataSeparator?: string
- [x] MAXMIND?: "1" | "2" => options.maxMindOn?: boolean
- [x] override_recur?: "Y" | "N" => recurringOptions.overrideRecurringPrice?: boolean
- [x] RID?: string => recurringOptions.rid: string
- [x] initial_amount?: string => recurringOptions.initialAmount?: number
- [x] recur_times?: string => recurringOptions.recurCycles: number = 0
- [x] OverRideRecureDay?: "Y" | "N" => recurringOptions.overrideRecurringDay?: boolean

Class Field Path | DirectAPI Key | Class Type | DirectAPI Type | Optional? (Class / API) | ⚠️ Notes / Conflicts
payment.amount | amount | number | string | No / No | 🔁 Type mismatch
payment.method.kind | trans_method | "CC" | "EFT" | "CC" | "EFT" | No / Yes | ⚠️ Optional in API only
payment.method.number (CC) | ccnum | string | string | No / Yes | ⚠️ Optional in API only
payment.method.expirationMonth (CC) | ccmo | string | string | No / Yes | ⚠️ Optional in API only
payment.method.expirationYear (CC) | ccyr | string | string | No / Yes | ⚠️ Optional in API only
payment.method.cvv2 (CC) | CVV2 | string | string | Yes / Yes | ✅ Match
payment.method.cvvType (CC) | CVVtype | "0" | "1" | "2" | "9" | "0" | "1" | "2" | "9" | Yes / Yes | ✅ Match
payment.method.aba (EFT) | aba | string | string | No / Yes | ⚠️ Optional in API only
payment.method.checkingAccountNumber (EFT) | checkacct | string | string | No / Yes | ⚠️ Optional in API only
payer.address | BADDR1 | string | string | No / No | ✅ Match
payer.zip | BZIP1 | string | string | No / No | ✅ Match
payer.email | BCUST_EMAIL | string | string | No / No | ✅ Match
payer.name | BNAME | string | string | Yes / Yes | ✅ Match
options.emailCustomerReceipt | override_email_customer | boolean | "Y" | "N" | No / No | 🔁 Type mismatch
options.sendTransactionEmail | override_trans_email | boolean | "Y" | "N" | No / No | 🔁 Type mismatch
options.transactionType | trans_type | TransactionType enum | TransactionType enum | Yes / Yes | ✅ Match
options.transactionID | transID | string | string | Yes / Yes | ✅ Match
options.restrictKey | RestrictKey | string | string | Yes / Yes | ✅ Match
options.dataSeparator | Dsep | string | string | Yes / Yes | ✅ Match
options.maxMindOn | MAXMIND | boolean | "1" | "2" | Yes / Yes | 🔁 Type mismatch
recurringOptions.rid | RID | string | string | No / Yes | ⚠️ Required if present
recurringOptions.overrideRecurringPrice | override_recur | boolean | "Y" | "N" | Yes / Yes | 🔁 Type mismatch
recurringOptions.initialAmount | initial_amount | number | string | Yes / Yes | 🔁 Type mismatch
recurringOptions.recurCycles | recur_times | number | string | No / Yes | 🔁 Type mismatch
recurringOptions.overrideRecurringDay | OverRideRecureDay | boolean | "Y" | "N" | Yes / Yes | 🔁 Type mismatch
