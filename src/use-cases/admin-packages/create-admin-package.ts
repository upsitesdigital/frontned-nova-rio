import {
  AdminPackagesApi,
  type AdminPackage,
  type SaveAdminPackagePayload,
} from "@/api/admin/admin-packages-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CreateAdminPackageResult {
  data: AdminPackage | null;
  error: string | null;
  isAuthError: boolean;
}

class CreateAdminPackage {
  static async createAdminPackage(
    payload: SaveAdminPackagePayload,
  ): Promise<CreateAdminPackageResult> {
    try {
      const data = await AdminPackagesApi.createAdminPackage(payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPackages.createError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CreateAdminPackage, type CreateAdminPackageResult };
