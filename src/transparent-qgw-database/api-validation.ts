import { z } from "zod";

// Helper validators
const isAmex = (cardNum: string) => /^3[47][0-9]{13}$/.test(cardNum);
const isVisa = (cardNum: string) => /^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNum);
const isMasterCard = (cardNum: string) => /^5[1-5][0-9]{14}$/.test(cardNum);
const isDiscover = (cardNum: string) =>
  /^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cardNum);

const cardValidator = z
  .string()
  .refine(
    (val) => isAmex(val) || isVisa(val) || isMasterCard(val) || isDiscover(val),
    { message: "Invalid card number format" }
  );

const monthValidator = z.string().regex(/^\d{2}$/, "Month must be two digits");
const yearValidator = z.string().regex(/^\d{2}$/, "Year must be two digits");
const numericString = z.string().regex(/^\d+$/, "Must be numerical");
const numericOrFloatString = z
  .string()
  .regex(/^\d*\.?\d+$/, "Must be a numerical value");
const email = z.string().email();
const yesNo = z.enum(["Y", "N"]);

const cvvValidator = z.string().refine((val) => /^\d{3,4}$/.test(val), {
  message: "CVV2 must be 3 or 4 digits",
});

// === SuperRefine Helpers ===

function validateCCFields(data: any, ctx: z.RefinementCtx) {
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  // Validate ccnum
  if (!data.ccnum) {
    ctx.addIssue({
      path: ["ccnum"],
      message: "ccnum is required for CC",
      code: z.ZodIssueCode.custom,
    });
  } else if (!cardValidator.safeParse(data.ccnum).success) {
    ctx.addIssue({
      path: ["ccnum"],
      message: "Invalid card number",
      code: z.ZodIssueCode.custom,
    });
  }

  // Validate ccmo
  if (!data.ccmo) {
    ctx.addIssue({
      path: ["ccmo"],
      message: "ccmo is required for CC",
      code: z.ZodIssueCode.custom,
    });
  } else if (!monthValidator.safeParse(data.ccmo).success) {
    ctx.addIssue({
      path: ["ccmo"],
      message: "Invalid month",
      code: z.ZodIssueCode.custom,
    });
  }

  // Validate ccyr
  if (!data.ccyr) {
    ctx.addIssue({
      path: ["ccyr"],
      message: "ccyr is required for CC",
      code: z.ZodIssueCode.custom,
    });
  } else if (!yearValidator.safeParse(data.ccyr).success) {
    ctx.addIssue({
      path: ["ccyr"],
      message: "Invalid year",
      code: z.ZodIssueCode.custom,
    });
  }

  // Validate expiration date
  if (data.ccmo && data.ccyr) {
    const inputMonth = parseInt(data.ccmo);
    const inputYear = parseInt(data.ccyr);
    const isFuture =
      inputYear > currentYear ||
      (inputYear === currentYear && inputMonth > currentMonth);

    if (!isFuture) {
      ctx.addIssue({
        path: ["ccmo"],
        message: "Card expiration date is in the past",
        code: z.ZodIssueCode.custom,
      });
    }
  }

  // Validate CVV2 length by card type
  if (data.CVV2 && data.ccnum) {
    const validLength = isAmex(data.ccnum) ? 4 : 3;
    if (data.CVV2.length !== validLength) {
      ctx.addIssue({
        path: ["CVV2"],
        message: `CVV2 must be ${validLength} digits for ${
          isAmex(data.ccnum) ? "AMEX" : "this card type"
        }`,
        code: z.ZodIssueCode.custom,
      });
    }
  }
}

function validateEFTFields(data: any, ctx: z.RefinementCtx) {
  if (!data.aba) {
    ctx.addIssue({
      path: ["aba"],
      message: "aba is required for EFT",
      code: z.ZodIssueCode.custom,
    });
  }
  if (!data.checkacct) {
    ctx.addIssue({
      path: ["checkacct"],
      message: "checkacct is required for EFT",
      code: z.ZodIssueCode.custom,
    });
  }
}

// === Main Schema ===

export const apiSchema = z
  .object({
    gwlogin: z.string(),
    trans_method: z
      .string()
      .toUpperCase()
      .pipe(z.enum(["CC", "EFT"]))
      .default("CC"),
    trans_type: z
      .enum([
        "CREDIT",
        "SALES",
        "AUTH_CAPTURE",
        "AUTH_ONLY",
        "RETURN",
        "VOID",
        "PREVIOUS_SALE",
      ])
      .optional(),
    transID: z.string().optional(),
    ccnum: z.string().optional(),
    ccmo: z.string().optional(),
    ccyr: z.string().optional(),
    aba: z.string().optional(),
    checkacct: z.string().optional(),
    amount: numericOrFloatString.refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
    BADDR1: z.string(),
    BZIP1: z.string(),
    BCUST_EMAIL: email,
    override_email_customer: yesNo.optional(),
    override_trans_email: yesNo.optional(),
    RestrictKey: z.string().optional(),
    BNAME: z.string().optional(),
    CVV2: cvvValidator.optional(),
    CVVtype: z.enum(["0", "1", "2", "9"]).optional(),
    Dsep: z.string().optional(),
    MAXMIND: z.enum(["1", "2"]).optional(),
    override_recur: yesNo.optional(),
    RID: numericString.optional(),
    initial_amount: numericOrFloatString.optional(),
    recur_times: numericString
      .optional()
      .refine((val) => !val || parseInt(val) >= 0, {
        message: "recur_times must be 0 or greater",
      }),
    OverRideRecureDay: yesNo.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.trans_method === "CC") {
      validateCCFields(data, ctx);
    } else if (data.trans_method === "EFT") {
      validateEFTFields(data, ctx);
    }
  });
