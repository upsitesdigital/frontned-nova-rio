import { z } from "zod/v4";
import { MESSAGES } from "@/lib/messages";

const loginSchema = z.object({
  email: z.string().min(1, MESSAGES.auth.fillAllFields).email(MESSAGES.auth.invalidEmail),
  password: z.string().min(1, MESSAGES.auth.fillAllFields),
});

type LoginInput = z.infer<typeof loginSchema>;

function validateLoginInput(input: LoginInput): string | null {
  const result = loginSchema.safeParse(input);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? MESSAGES.auth.fillAllFields;
}

export { validateLoginInput, loginSchema, type LoginInput };
