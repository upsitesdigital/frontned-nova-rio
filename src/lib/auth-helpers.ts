import { HttpClientError } from "@/api/http-client";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";
import { MESSAGES } from "@/lib/messages";

async function getAuthToken(): Promise<string | null> {
  await waitForAuthHydration();
  return useAuthStore.getState().accessToken;
}

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpClientError) {
    if (error.status === 401) return MESSAGES.auth.sessionExpired;
    return error.message;
  }
  return fallback;
}

export { getAuthToken, resolveErrorMessage };
