import { AuthApi } from "@/api/core/auth-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface PasswordResetRequestResult {
  success: boolean;
  error: string | null;
}

class RequestPasswordReset {
  static async requestPasswordResetCode(email: string): Promise<PasswordResetRequestResult> {
    try {
      await AuthApi.requestPasswordReset({ email });
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.password.resetSendError),
      };
    }
  }
}

export { RequestPasswordReset, type PasswordResetRequestResult };
