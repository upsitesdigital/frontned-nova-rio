import isEmail from "validator/es/lib/isEmail";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import { z } from "zod/v4";

const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").refine(isEmail, "E-mail inválido"),
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
});

type RegisterSchema = z.infer<typeof registerSchema>;

interface RegisterFieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

function validateRegister(data: RegisterSchema): RegisterFieldErrors {
  const result = registerSchema.safeParse(data);
  if (result.success) return {};

  const errors: RegisterFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RegisterFieldErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

function mapApiErrorToField(status: number, message: string): RegisterFieldErrors {
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
  registerSchema,
  validateRegister,
  mapApiErrorToField,
  type RegisterSchema,
  type RegisterFieldErrors,
};
