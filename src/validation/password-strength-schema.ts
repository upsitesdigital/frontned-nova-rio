import { z } from "zod/v4";
import { MESSAGES } from "@/lib/messages";

const passwordSchema = z
  .string()
  .min(8, MESSAGES.password.weak)
  .refine((v) => /[a-z]/.test(v), MESSAGES.password.weak)
  .refine((v) => /[A-Z]/.test(v), MESSAGES.password.weak)
  .refine((v) => /[0-9]/.test(v), MESSAGES.password.weak)
  .refine((v) => /[^a-zA-Z0-9]/.test(v), MESSAGES.password.weak);

function validatePasswordStrength(password: string): string | null {
  const result = passwordSchema.safeParse(password);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? MESSAGES.password.weak;
}

function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return MESSAGES.password.mismatch;
  }
  return null;
}

export { validatePasswordStrength, validatePasswordMatch, passwordSchema };
