import { z } from "zod/v4";

function isStrongPassword(v: string): boolean {
  return (
    v.length >= 8 &&
    /[A-Z]/.test(v) &&
    /[a-z]/.test(v) &&
    /[0-9]/.test(v) &&
    /[^A-Za-z0-9]/.test(v)
  );
}

const resetPasswordSchema = z
  .object({
    code: z.string().length(6, "O código deve ter 6 dígitos"),
    newPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .refine(isStrongPassword, "A senha deve conter maiúscula, minúscula, número e símbolo"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

interface ResetPasswordFieldErrors {
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

function validateResetPassword(
  data: z.input<typeof resetPasswordSchema>,
): ResetPasswordFieldErrors {
  const result = resetPasswordSchema.safeParse(data);
  if (result.success) return {};

  const errors: ResetPasswordFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ResetPasswordFieldErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

interface PasswordHint {
  label: string;
  met: boolean;
}

function getPasswordHints(password: string): PasswordHint[] {
  return [
    {
      label: "Mínimo de 8 caracteres",
      met: password.length >= 8,
    },
    {
      label: "Uma letra maiúscula",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Uma letra minúscula",
      met: /[a-z]/.test(password),
    },
    {
      label: "Um número",
      met: /[0-9]/.test(password),
    },
    {
      label: "Um símbolo",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

export {
  validateResetPassword,
  getPasswordHints,
  type ResetPasswordFieldErrors,
  type PasswordHint,
};
