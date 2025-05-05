Form Validation

note: anything without the required field is optional.
optional just means two things:

1. the field value's type is undefined or
2. the field doesn't exist

- [x] gwlogin:
      type: string;
      required
- [x] trans_method:
      type: "CC" or "EFT" (case insensitive); Must ONLY be CC or EFT.
      default value if trans_method is falsy = "CC"
      special instructions:

        Validate different fields depending on trans_method.
        example: - CC requires ccnum, ccmo, ccyr. - EFT requires aba and checkacct.

- [x] trans_type:
      type: TransactionType: "CREDIT" | "SALE" | "AUTH_CAPTURE" | "AUTH_ONLY" | "RETURN" | "VOID" |"PREVIOUS_SALE"
- [x] transID:
      type: string;
- [x] ccnum:
      type: string | undefined;
      must be amex, mastercard, visa, or discover formatted.
      required if CC is trans_method. undefined otherwise.
- [x] ccmo:
      type: string | undefined;
      must be 2 digits.
      cc month + cc year should be > current month + year
      required if CC is trans_method. undefined otherwise.
- [x] ccyr:
      type: string | undefined;
      must be 2 digits.
      cc month + cc year should be > current month + year
      required if CC is trans_method. undefined otherwise.
- [x] aba:
      type: string | undefined;
      required if EFT is trans_method. undefined otherwise.
- [x] checkacct:
      type: string | undefined;
      required if EFT is trans_method. undefined otherwise.
- [x] amount:
      type: string;
      required.
      must be numerical.
      must be greater than 0.
- [x] BADDR1:
      type: string
      required
- [x] BZIP1:
      type: string;
      required
- [x] BCUST_EMAIL:
      type: string;
      email formatted
      required
- [x] override_email_customer:
      type: "Y" | "N";
- [x] override_trans_email:
      type: "Y" | "N";
- [x] RestrictKey:
      type: string;
- [x] BNAME:
      type: string;
- [x] CVV2:
      type: string;
      must be numerical
      if ccnum is amex cvv2 is 4 digits otherwise 3 digits
- [x] CVVtype:
      type: "0" | "1" | "2" | "9";
- [x] Dsep:
      type: string;
- [x] MAXMIND:
      type: "1" | "2";
- [x] override_recur:
      type: "Y"";
- [x] RID:
      type: string;
      must be numerical
- [x] initial_amount:
      type: string;
      must be numerical
- [x] recur_times:
      type: string;
      must be numerical
      must be 0 or greater
- [x] OverRideRecureDay:
      type: "Y" | "N";
