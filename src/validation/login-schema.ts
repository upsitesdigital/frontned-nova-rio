import { MESSAGES } from "@/lib/messages";
import { isValidEmail } from "@/validation/email-schema";

interface LoginInput {
  email: string;
  password: string;
}

function validateLoginInput(input: LoginInput): string | null {
  if (!input.email.trim() || !input.password.trim()) {
    return MESSAGES.auth.fillAllFields;
  }

  if (!isValidEmail(input.email)) {
    return MESSAGES.auth.invalidEmail;
  }

  return null;
}

export { validateLoginInput, type LoginInput };
