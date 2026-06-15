import { AdminPackagesApi } from "@/api/admin/admin-packages-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface ReactivateAdminPackageResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class ReactivateAdminPackage {
  static async reactivateAdminPackage(id: number): Promise<ReactivateAdminPackageResult> {
    try {
      await AdminPackagesApi.reactivateAdminPackage(id);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPackages.reactivateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { ReactivateAdminPackage, type ReactivateAdminPackageResult };
