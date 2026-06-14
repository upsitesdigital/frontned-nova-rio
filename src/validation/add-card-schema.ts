import { z } from "zod/v4";
import { Messages } from "@/lib/core/messages";

const addCardSchema = z.object({
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .min(13, Messages.cards.invalidNumber)
        .max(19, Messages.cards.invalidNumber)
        .refine((v) => luhnCheck(v), Messages.cards.invalidNumber),
    ),
  holderName: z.string().min(1, Messages.cards.missingHolder),
  expiryMonth: z.string().min(1, Messages.cards.missingMonth),
  expiryYear: z.string().min(1, Messages.cards.missingYear),
  cvv: z
    .string()
    .min(1, Messages.cards.missingCvv)
    .regex(/^\d{3,4}$/, Messages.cards.invalidCvv),
});

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

interface AddCardFormErrors {
  cardNumber?: string;
  holderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}

interface AddCardFormInput {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

function validateAddCardForm(input: AddCardFormInput): AddCardFormErrors {
  const result = addCardSchema.safeParse(input);
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

export { validateAddCardForm, type AddCardFormErrors, type AddCardFormInput };
