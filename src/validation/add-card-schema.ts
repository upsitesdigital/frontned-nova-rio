import { z } from "zod/v4";
import { MESSAGES } from "@/lib/messages";

const addCardSchema = z.object({
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .min(13, MESSAGES.cards.invalidNumber)
        .max(19, MESSAGES.cards.invalidNumber)
        .refine((v) => luhnCheck(v), MESSAGES.cards.invalidNumber),
    ),
  holderName: z.string().min(1, MESSAGES.cards.missingHolder),
  expiryMonth: z.string().min(1, MESSAGES.cards.missingMonth),
  expiryYear: z.string().min(1, MESSAGES.cards.missingYear),
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
}

interface AddCardFormInput {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
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
