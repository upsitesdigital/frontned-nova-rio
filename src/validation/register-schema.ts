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

const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .refine(isStrongPassword, "A senha deve conter maiúscula, minúscula, número e símbolo"),
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
