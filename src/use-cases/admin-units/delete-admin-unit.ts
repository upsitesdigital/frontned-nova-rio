import { AdminUnitsApi } from "@/api/admin/admin-units-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface DeleteAdminUnitResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class DeleteAdminUnit {
  static async deleteAdminUnit(id: number): Promise<DeleteAdminUnitResult> {
    try {
      await AdminUnitsApi.deleteAdminUnit(id);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUnits.deleteError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { DeleteAdminUnit, type DeleteAdminUnitResult };
