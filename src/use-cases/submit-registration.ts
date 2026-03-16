import { registerClient } from "@/api/auth-api";
import { MESSAGES } from "@/lib/messages";
import { HttpClientError } from "@/api/http-client";
import {
  validateRegister,
  mapApiErrorToField,
  type RegisterFieldErrors,
} from "@/validation/register-schema";

interface RegistrationInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

function validateRegistrationInput(input: RegistrationInput): RegisterFieldErrors {
  return validateRegister({
    name: input.name,
    email: input.email,
    password: input.password,
  });
}

async function submitRegistration(input: RegistrationInput): Promise<RegisterFieldErrors> {
  try {
    await registerClient({
      name: input.name,
      email: input.email,
      phone: input.phone || undefined,
      password: input.password,
    });

    return {};
  } catch (error) {
    if (error instanceof HttpClientError) {
      return mapApiErrorToField(error.status, error.message);
    }
    return { email: MESSAGES.registration.genericError };
  }
}

export { validateRegistrationInput, submitRegistration, type RegistrationInput };
