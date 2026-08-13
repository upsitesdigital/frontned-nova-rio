import { HttpClientError } from "@/lib/auth/http-error";
import { Messages } from "@/lib/core/messages";

class AuthHelpers {
  static isAuthError(error: unknown): boolean {
    return error instanceof HttpClientError && (error.status === 401 || error.status === 403);
  }

  static resolveErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpClientError) {
      if (error.status === 401) return Messages.auth.sessionExpired;
      if (error.status >= 500) return fallback;
      return error.message;
    }
    return fallback;
  }
}

export { AuthHelpers };
