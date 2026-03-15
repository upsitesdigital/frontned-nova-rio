import { HttpClientError } from "@/api/http-client";
import { MESSAGES } from "@/lib/messages";

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpClientError) {
    if (error.status === 401) return MESSAGES.auth.sessionExpired;
    return error.message;
  }
  return fallback;
}

export { resolveErrorMessage };
