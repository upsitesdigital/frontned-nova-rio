import isEmail from "validator/es/lib/isEmail";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import { z } from "zod/v4";

const createAccountSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "E-mail é obrigatório").refine(isEmail, "E-mail inválido"),
    phone: z.string().optional(),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

interface CreateAccountFieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

function validateCreateAccount(
  data: z.input<typeof createAccountSchema>,
): CreateAccountFieldErrors {
  const result = createAccountSchema.safeParse(data);
  if (result.success) return {};

  const errors: CreateAccountFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CreateAccountFieldErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

function mapApiErrorToField(status: number, message: string): CreateAccountFieldErrors {
  if (status === 409) return { email: "Este e-mail já está cadastrado" };

  const lower = message.toLowerCase();
  if (lower.includes("email")) return { email: "E-mail inválido" };
  if (lower.includes("password") || lower.includes("senha"))
    return { password: "A senha deve conter maiúscula, minúscula, número e símbolo" };
  if (lower.includes("name") || lower.includes("nome")) return { name: "Nome inválido" };
  if (lower.includes("phone") || lower.includes("telefone")) return { phone: "Telefone inválido" };
  return { email: "Erro ao cadastrar. Tente novamente." };
}

export {
  validateCreateAccount,
  mapApiErrorToField,
  type CreateAccountFieldErrors,
};
