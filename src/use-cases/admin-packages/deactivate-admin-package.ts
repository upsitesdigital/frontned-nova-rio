import { AdminPackagesApi } from "@/api/admin/admin-packages-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface DeactivateAdminPackageResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class DeactivateAdminPackage {
  static async deactivateAdminPackage(id: number): Promise<DeactivateAdminPackageResult> {
    try {
      await AdminPackagesApi.deactivateAdminPackage(id);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPackages.deactivateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { DeactivateAdminPackage, type DeactivateAdminPackageResult };
