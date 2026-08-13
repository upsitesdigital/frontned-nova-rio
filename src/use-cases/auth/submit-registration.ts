import { AuthApi } from "@/api/core/auth-api";
import { Messages } from "@/lib/core/messages";
import { Formatters } from "@/lib/formatting/formatters";
import { HttpClientError } from "@/api/core/http-client";
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

class SubmitRegistration {
  static validateRegistrationInput(input: RegistrationInput): RegisterFieldErrors {
    return validateRegister({
      name: input.name,
      email: input.email,
      password: input.password,
    });
  }

  static async submitRegistration(input: RegistrationInput): Promise<RegisterFieldErrors> {
    try {
      const normalizedPhone = input.phone ? Formatters.stripDdi(input.phone) : "";

      await AuthApi.registerClient({
        name: input.name,
        email: input.email,
        phone: normalizedPhone || undefined,
        password: input.password,
      });

      return {};
    } catch (error) {
      if (error instanceof HttpClientError) {
        return mapApiErrorToField(error.status, error.message);
      }
      return { email: Messages.registration.genericError };
    }
  }
}

export { SubmitRegistration, type RegistrationInput };
