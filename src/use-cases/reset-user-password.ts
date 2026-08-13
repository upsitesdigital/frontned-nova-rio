import { resetPassword } from "@/api/auth-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface ResetPasswordResult {
  success: boolean;
  error: string | null;
}

async function resetUserPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<ResetPasswordResult> {
  try {
    await resetPassword({ email, code, newPassword });
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.password.resetError),
    };
  }
}

export { resetUserPassword, type ResetPasswordResult };
