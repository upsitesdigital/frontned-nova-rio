import { registerClient } from "@/api/auth-api";
import { HttpClientError } from "@/api/http-client";
import { MESSAGES } from "@/lib/messages";
import { mapApiErrorToField, type CreateAccountFieldErrors } from "@/validation/create-account-schema";

interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

async function registerNewAccount(input: RegisterInput): Promise<CreateAccountFieldErrors> {
  try {
    await registerClient({
      name: input.name,
      email: input.email,
      phone: input.phone,
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

export { registerNewAccount, type RegisterInput };
