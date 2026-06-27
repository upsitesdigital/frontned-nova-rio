import { AuthApi } from "@/api/core/auth-api";
import { HttpClientError } from "@/api/core/http-client";
import { Formatters } from "@/lib/formatting/formatters";
import { Messages } from "@/lib/core/messages";
import {
  mapApiErrorToField,
  type CreateAccountFieldErrors,
} from "@/validation/create-account-schema";

interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

class RegisterNewAccount {
  static async registerNewAccount(input: RegisterInput): Promise<CreateAccountFieldErrors> {
    try {
      const normalizedPhone = input.phone ? Formatters.stripDdi(input.phone) : undefined;

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

export { RegisterNewAccount, type RegisterInput };
