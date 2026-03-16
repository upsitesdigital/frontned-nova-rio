import { requestPasswordReset } from "@/api/auth-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface PasswordResetRequestResult {
  success: boolean;
  error: string | null;
}

async function requestPasswordResetCode(email: string): Promise<PasswordResetRequestResult> {
  try {
    await requestPasswordReset({ email });
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.password.resetSendError),
    };
  }
}

export { requestPasswordResetCode, type PasswordResetRequestResult };
