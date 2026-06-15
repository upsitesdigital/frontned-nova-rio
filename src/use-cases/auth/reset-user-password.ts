import { AuthApi } from "@/api/core/auth-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface ResetPasswordResult {
  success: boolean;
  error: string | null;
}

class ResetUserPassword {
  static async resetUserPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<ResetPasswordResult> {
    try {
      await AuthApi.resetPassword({ email, code, newPassword });
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.password.resetError),
      };
    }
  }
}

export { ResetUserPassword, type ResetPasswordResult };
