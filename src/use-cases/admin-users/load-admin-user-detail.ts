import { AdminUsersApi, type AdminUser } from "@/api/admin/admin-users-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminUserDetailResult {
  data: AdminUser | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminUserDetail {
  static async loadAdminUserDetail(userId: number): Promise<LoadAdminUserDetailResult> {
    try {
      const data = await AdminUsersApi.fetchAdminUserById(userId);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUsers.detailError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminUserDetail, type LoadAdminUserDetailResult };
