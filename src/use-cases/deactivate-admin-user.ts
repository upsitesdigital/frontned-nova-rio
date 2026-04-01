import { deactivateAdminUser as deactivateAdminUserApi } from "@/api/admin-users-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface DeactivateAdminUserResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function deactivateAdminUser(id: number): Promise<DeactivateAdminUserResult> {
  try {
    await deactivateAdminUserApi(id);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminUsers.deactivateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { deactivateAdminUser, type DeactivateAdminUserResult };