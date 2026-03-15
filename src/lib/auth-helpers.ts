import { HttpClientError } from "@/api/http-client";
import { MESSAGES } from "@/lib/messages";

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpClientError) {
    if (error.status === 401) return MESSAGES.auth.sessionExpired;
    if (error.status >= 500) return fallback;
    return error.message;
  }
  return fallback;
}

export { resolveErrorMessage };
