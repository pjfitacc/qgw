import { z } from "zod";
import { PaymentSchema } from "./payment.schema";
import { PayerSchema } from "./payer.schema";
import { OptionsSchema } from "./options.schema";
import { RecurringOptionsSchema } from "./recurringOptions.schema";

/**
 * This schema validates the input for the TransactionRequest object.
 */
export const transactionRequestSchema = z.object({
  payment: PaymentSchema,
  payer: PayerSchema,
  options: OptionsSchema.optional(),
  recurringOptions: RecurringOptionsSchema.optional(),
});
