// payment.schema.ts
import { z } from "zod";

export const CvvTypeSchema = z.enum(["0", "1", "2", "9"]);

export const CreditCardSchema = z.object({
  kind: z.literal("CC"),
  number: z.string(),
  expirationMonth: z.string(),
  expirationYear: z.string(),
  cvv2: z.string().optional(),
  cvvType: CvvTypeSchema.optional(),
});

export const ElectronicFundsTransferSchema = z.object({
  kind: z.literal("EFT"),
  aba: z.string(),
  checkingAccountNumber: z.string(),
});

export const PaymentSchema = z.object({
  amount: z.number(),
  method: z.union([CreditCardSchema, ElectronicFundsTransferSchema]),
});
