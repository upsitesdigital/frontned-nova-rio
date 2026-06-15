import {
  AdminPackagesApi,
  type AdminPackage,
  type SaveAdminPackagePayload,
} from "@/api/admin/admin-packages-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface UpdateAdminPackageResult {
  data: AdminPackage | null;
  error: string | null;
  isAuthError: boolean;
}

class UpdateAdminPackage {
  static async updateAdminPackage(
    id: number,
    payload: Partial<SaveAdminPackagePayload>,
  ): Promise<UpdateAdminPackageResult> {
    try {
      const data = await AdminPackagesApi.updateAdminPackage(id, payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPackages.updateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { UpdateAdminPackage, type UpdateAdminPackageResult };
