// payer.schema.ts
import { z } from "zod";

export const PayerSchema = z.object({
  address: z.string(),
  zip: z.string(),
  email: z.string().email(),
  name: z.string().default("anonymous"),
});
