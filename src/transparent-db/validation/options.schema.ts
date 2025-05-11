// options.schema.ts
import { z } from "zod";

export const OptionsSchema = z.object({
  emailCustomerReceipt: z.boolean().optional(),
  sendTransactionEmail: z.boolean().optional(),
  transactionType: z
    .enum(["SALE", "AUTH", "CREDIT", "VOID", "PREVIOUS_SALE", "POSTAUTH"])
    .optional(), // Adjust based on your TransactionType enum
  transactionID: z.string().optional(),
  restrictKey: z.string().optional(),
  dataSeparator: z.string().optional(),
  maxMindOn: z.boolean().optional(),
});
