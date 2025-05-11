// recurringOptions.schema.ts
import { z } from "zod";

export const RecurringOptionsSchema = z.object({
  rid: z.string(),
  recurCycles: z.number().optional(),
  overrideRecurringPrice: z.boolean().optional(),
  initialAmount: z.number().optional(),
  overrideRecurringDay: z.boolean().optional(),
});
