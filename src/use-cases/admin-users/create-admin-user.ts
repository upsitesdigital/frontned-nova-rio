import {
  AdminUsersApi,
  type AdminUser,
  type CreateAdminUserPayload,
} from "@/api/admin/admin-users-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CreateAdminUserResult {
  data: AdminUser | null;
  error: string | null;
  isAuthError: boolean;
}

class CreateAdminUser {
  static async createAdminUser(payload: CreateAdminUserPayload): Promise<CreateAdminUserResult> {
    try {
      const data = await AdminUsersApi.createAdminUser(payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUsers.createError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CreateAdminUser, type CreateAdminUserResult };
