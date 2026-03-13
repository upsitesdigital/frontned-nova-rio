import isStrongPassword from "validator/es/lib/isStrongPassword";
import { z } from "zod/v4";

const resetPasswordSchema = z
  .object({
    code: z.string().length(6, "O código deve ter 6 dígitos"),
    newPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .refine(
        (v) =>
          isStrongPassword(v, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        "A senha deve conter maiúscula, minúscula, número e símbolo",
      ),
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
      met: isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      }),
    },
    {
      label: "Uma letra maiúscula",
      met: isStrongPassword(password, {
        minLength: 0,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 0,
      }),
    },
    {
      label: "Uma letra minúscula",
      met: isStrongPassword(password, {
        minLength: 0,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      }),
    },
    {
      label: "Um número",
      met: isStrongPassword(password, {
        minLength: 0,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      }),
    },
    {
      label: "Um símbolo",
      met: isStrongPassword(password, {
        minLength: 0,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 1,
      }),
    },
  ];
}

export {
  validateResetPassword,
  getPasswordHints,
  type ResetPasswordFieldErrors,
  type PasswordHint,
};
