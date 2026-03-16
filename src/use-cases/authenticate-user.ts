import { login, type UserType } from "@/api/auth-api";
import { HttpClientError } from "@/api/http-client";
import { MESSAGES } from "@/lib/messages";

type AuthResult =
  | { type: "success"; accessToken: string; refreshToken: string; userType: UserType }
  | { type: "pending" }
  | { type: "invalidCredentials" }
  | { type: "error"; message: string };

async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const result = await login({ email, password });
    return {
      type: "success",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      userType: result.userType,
    };
  } catch (error) {
    if (error instanceof HttpClientError) {
      if (error.status === 403) return { type: "pending" };
      if (error.status === 401) return { type: "invalidCredentials" };
      return { type: "error", message: error.message };
    }
    return { type: "error", message: MESSAGES.auth.loginError };
  }
}

export { authenticateUser, type AuthResult };
