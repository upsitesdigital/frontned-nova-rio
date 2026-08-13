import { AdminServicesApi } from "@/api/admin/admin-services-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface DeleteAdminServiceResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class DeleteAdminService {
  static async deleteAdminService(id: number): Promise<DeleteAdminServiceResult> {
    try {
      await AdminServicesApi.deleteAdminService(id);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminServices.deleteError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { DeleteAdminService, type DeleteAdminServiceResult };
