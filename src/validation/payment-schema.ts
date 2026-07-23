import { z } from "zod/v4";

import { Formatters } from "@/lib/formatting/formatters";

export interface PaymentFieldErrors {
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  billingName?: string;
  billingDocument?: string;
  billingAddress?: string;
}

interface CardData {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

interface BillingData {
  billingName: string;
  billingDocument: string;
  billingAddress: string;
}

export class PaymentValidation {
  private static luhnCheck(value: string): boolean {
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

  private static isExpiryFormat(value: string): boolean {
    const parts = value.split("/");
    if (parts.length !== 2) return false;
    return parts.every((part) => part.length === 2 && Formatters.onlyDigits(part) === part);
  }

  private static isCvvFormat(value: string): boolean {
    return Formatters.onlyDigits(value) === value && value.length >= 3 && value.length <= 4;
  }

  private static readonly cardSchema = z.object({
    cardNumber: z
      .string()
      .min(1, "Número do cartão é obrigatório")
      .transform((v) => Formatters.onlyDigits(v))
      .pipe(
        z
          .string()
          .min(13, "Número do cartão inválido")
          .max(19, "Número do cartão inválido")
          .refine((v) => PaymentValidation.luhnCheck(v), "Número do cartão inválido"),
      ),
    cardExpiry: z
      .string()
      .min(1, "Validade é obrigatória")
      .refine((v) => PaymentValidation.isExpiryFormat(v), "Formato inválido (MM/AA)")
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
      .refine((v) => PaymentValidation.isCvvFormat(v), "CVV inválido"),
    cardName: z.string().min(1, "Nome no cartão é obrigatório"),
  });

  private static readonly billingSchema = z.object({
    billingName: z.string().min(1, "Nome é obrigatório"),
    billingDocument: z
      .string()
      .min(1, "CPF/CNPJ é obrigatório")
      .refine((v) => {
        const digits = Formatters.onlyDigits(v);
        return digits.length === 11 || digits.length === 14;
      }, "CPF ou CNPJ inválido"),
    billingAddress: z.string().min(1, "Endereço é obrigatório"),
  });

  private static extractErrors(issues: z.core.$ZodIssue[]): PaymentFieldErrors {
    const errors: PaymentFieldErrors = {};
    for (const issue of issues) {
      const field = issue.path[0] as keyof PaymentFieldErrors;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return errors;
  }

  static validateCard(data: CardData): PaymentFieldErrors {
    const result = PaymentValidation.cardSchema.safeParse(data);
    if (result.success) return {};
    return PaymentValidation.extractErrors(result.error.issues);
  }

  static validateBilling(data: BillingData): PaymentFieldErrors {
    const result = PaymentValidation.billingSchema.safeParse(data);
    if (result.success) return {};
    return PaymentValidation.extractErrors(result.error.issues);
  }

  static validatePayment(
    isCardMethod: boolean,
    card: CardData,
    billing: BillingData,
  ): PaymentFieldErrors {
    const billingErrors = PaymentValidation.validateBilling(billing);
    if (!isCardMethod) return billingErrors;
    return { ...PaymentValidation.validateCard(card), ...billingErrors };
  }
}
