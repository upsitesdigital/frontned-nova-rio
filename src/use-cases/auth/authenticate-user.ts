import { AuthApi, type UserType } from "@/api/core/auth-api";
import { HttpClientError } from "@/api/core/http-client";
import { Messages } from "@/lib/core/messages";

type AuthResult =
  | { type: "success"; accessToken: string; refreshToken: string; userType: UserType }
  | { type: "pending" }
  | { type: "invalidCredentials" }
  | { type: "error"; message: string };

class AuthenticateUser {
  static async authenticateUser(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await AuthApi.login({ email, password });
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
      return { type: "error", message: Messages.auth.loginError };
    }
  }
}

export { AuthenticateUser, type AuthResult };
