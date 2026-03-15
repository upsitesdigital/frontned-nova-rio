import { z } from "zod/v4";

const emailSchema = z.string().email();

function isValidEmail(value: string): boolean {
  return emailSchema.safeParse(value.trim()).success;
}

export { isValidEmail };
