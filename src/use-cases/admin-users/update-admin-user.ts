import {
  AdminUsersApi,
  type AdminUser,
  type UpdateAdminUserPayload,
} from "@/api/admin/admin-users-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

export interface UpdateAdminUserResult {
  data: AdminUser | null;
  error: string | null;
  isAuthError: boolean;
}

export class UpdateAdminUser {
  static async updateAdminUser(
    id: number,
    payload: UpdateAdminUserPayload,
  ): Promise<UpdateAdminUserResult> {
    try {
      const data = await AdminUsersApi.updateAdminUser(id, payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUsers.updateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}
