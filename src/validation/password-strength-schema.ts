import { z } from "zod/v4";
import { Messages } from "@/lib/core/messages";

const passwordSchema = z
  .string()
  .min(8, Messages.password.weak)
  .refine((v) => /[a-z]/.test(v), Messages.password.weak)
  .refine((v) => /[A-Z]/.test(v), Messages.password.weak)
  .refine((v) => /[0-9]/.test(v), Messages.password.weak)
  .refine((v) => /[^a-zA-Z0-9]/.test(v), Messages.password.weak);

function validatePasswordStrength(password: string): string | null {
  const result = passwordSchema.safeParse(password);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? Messages.password.weak;
}

function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return Messages.password.mismatch;
  }
  return null;
}

function isStrongPassword(v: string): boolean {
  return (
    v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v)
  );
}

export { validatePasswordStrength, validatePasswordMatch, isStrongPassword, passwordSchema };
