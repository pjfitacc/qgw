/**
 * This module contains the validation schema for the TransactionRequest found in the transactionRequestSchema variable.
 * @module
 *
 * @privateRemarks
 * TODO: Standardize Error Messaging
 */
import { z } from "zod";
import { PaymentSchema } from "./payment.schema";
import { PayerSchema } from "./payer.schema";
import { OptionsSchema } from "./options.schema";
import { RecurringOptionsSchema } from "./recurringOptions.schema";

/**
 * This schema validates the input for the TransactionRequest object.
 * It checks for required fields, valid formats, and custom validation rules.
 * To use this schema, pass your input data to the `transactionRequestSchema.parse(data)` method.
 *
 * @privateRemarks
 * standardize the error format for validation
 */
export const transactionRequestSchema = z.object({
  payment: PaymentSchema,
  payer: PayerSchema,
  options: OptionsSchema.optional(),
  recurringOptions: RecurringOptionsSchema.optional(),
});
