import { z } from "zod/v4";

function luhnCheck(value: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = value.length - 1; i >= 0; i--) {
    let n = parseInt(value.charAt(i), 10);
    if (isNaN(n)) return false;
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Número do cartão é obrigatório")
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .min(13, "Número do cartão inválido")
        .max(19, "Número do cartão inválido")
        .refine(luhnCheck, "Número do cartão inválido"),
    ),
  cardExpiry: z
    .string()
    .min(1, "Validade é obrigatória")
    .regex(/^\d{2}\/\d{2}$/, "Formato inválido (MM/AA)")
    .refine((v) => {
      const [mm, yy] = v.split("/").map(Number);
      if (mm < 1 || mm > 12) return false;
      const now = new Date();
      const expiryDate = new Date(2000 + yy, mm);
      return expiryDate > now;
    }, "Cartão vencido"),
  cardCvv: z
    .string()
    .min(1, "CVV é obrigatório")
    .regex(/^\d{3,4}$/, "CVV inválido"),
  cardName: z.string().min(1, "Nome no cartão é obrigatório"),
});

const billingSchema = z.object({
  billingName: z.string().min(1, "Nome é obrigatório"),
  billingDocument: z
    .string()
    .min(1, "CPF/CNPJ é obrigatório")
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length === 11 || digits.length === 14;
    }, "CPF ou CNPJ inválido"),
  billingAddress: z.string().min(1, "Endereço é obrigatório"),
});

interface PaymentFieldErrors {
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  billingName?: string;
  billingDocument?: string;
  billingAddress?: string;
}

function extractErrors(issues: z.core.$ZodIssue[]): PaymentFieldErrors {
  const errors: PaymentFieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof PaymentFieldErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

function validateCard(data: {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}): PaymentFieldErrors {
  const result = cardSchema.safeParse(data);
  if (result.success) return {};
  return extractErrors(result.error.issues);
}

function validateBilling(data: {
  billingName: string;
  billingDocument: string;
  billingAddress: string;
}): PaymentFieldErrors {
  const result = billingSchema.safeParse(data);
  if (result.success) return {};
  return extractErrors(result.error.issues);
}

function validatePayment(
  isCardMethod: boolean,
  card: { cardNumber: string; cardExpiry: string; cardCvv: string; cardName: string },
  billing: { billingName: string; billingDocument: string; billingAddress: string },
): PaymentFieldErrors {
  const billingErrors = validateBilling(billing);
  if (!isCardMethod) return billingErrors;
  return { ...validateCard(card), ...billingErrors };
}

export { validatePayment, validateCard, validateBilling, type PaymentFieldErrors };
