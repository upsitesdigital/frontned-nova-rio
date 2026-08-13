import { z } from "zod/v4";
import { Formatters } from "@/lib/formatting/formatters";
import { Messages } from "@/lib/core/messages";

export interface AddCardFormErrors {
  cardNumber?: string;
  holderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}

export interface AddCardFormInput {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export class AddCardValidation {
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

  private static readonly schema = z
    .object({
      cardNumber: z
        .string()
        .transform((v) => Formatters.onlyDigits(v))
        .pipe(
          z
            .string()
            .min(13, Messages.cards.invalidNumber)
            .max(19, Messages.cards.invalidNumber)
            .refine((v) => AddCardValidation.luhnCheck(v), Messages.cards.invalidNumber),
        ),
      holderName: z.string().min(1, Messages.cards.missingHolder),
      expiryMonth: z
        .string()
        .min(1, Messages.cards.missingMonth)
        .refine((v) => {
          const month = Number(v);
          return Number.isInteger(month) && month >= 1 && month <= 12;
        }, Messages.cards.invalidMonth),
      expiryYear: z.string().min(1, Messages.cards.missingYear),
      cvv: z
        .string()
        .min(1, Messages.cards.missingCvv)
        .refine(
          (v) => Formatters.onlyDigits(v) === v && v.length >= 3 && v.length <= 4,
          Messages.cards.invalidCvv,
        ),
    })
    .refine(
      (input) => {
        const month = Number(input.expiryMonth);
        const year = Number(input.expiryYear);
        if (!Number.isInteger(month) || month < 1 || month > 12) return true;
        if (!Number.isInteger(year)) return true;
        // Card is valid through the end of its expiry month.
        const firstDayAfterExpiry = new Date(year, month, 1);
        return firstDayAfterExpiry > new Date();
      },
      { message: Messages.cards.expired, path: ["expiryMonth"] },
    );

  static validateForm(input: AddCardFormInput): AddCardFormErrors {
    const result = AddCardValidation.schema.safeParse(input);
    if (result.success) return {};

    const errors: AddCardFormErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof AddCardFormErrors;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return errors;
  }
}
