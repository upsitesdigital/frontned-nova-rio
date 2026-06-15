import { AdminUsersApi } from "@/api/admin/admin-users-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface DeactivateAdminUserResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class DeactivateAdminUser {
  static async deactivateAdminUser(id: number): Promise<DeactivateAdminUserResult> {
    try {
      await AdminUsersApi.deactivateAdminUser(id);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUsers.deactivateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { DeactivateAdminUser, type DeactivateAdminUserResult };
