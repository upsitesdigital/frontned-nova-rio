import { z } from "zod/v4";
import { Messages } from "@/lib/core/messages";

const loginSchema = z.object({
  email: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, Messages.auth.fillAllFields).email(Messages.auth.invalidEmail)),
  password: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, Messages.auth.fillAllFields)),
});

type LoginInput = z.infer<typeof loginSchema>;

function validateLoginInput(input: LoginInput): string | null {
  const result = loginSchema.safeParse(input);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? Messages.auth.fillAllFields;
}

export { validateLoginInput, loginSchema, type LoginInput };
