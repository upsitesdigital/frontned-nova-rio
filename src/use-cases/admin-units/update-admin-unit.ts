import {
  AdminUnitsApi,
  type AdminUnit,
  type SaveAdminUnitPayload,
} from "@/api/admin/admin-units-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface UpdateAdminUnitResult {
  data: AdminUnit | null;
  error: string | null;
  isAuthError: boolean;
}

class UpdateAdminUnit {
  static async updateAdminUnit(
    id: number,
    payload: Partial<SaveAdminUnitPayload>,
  ): Promise<UpdateAdminUnitResult> {
    try {
      const data = await AdminUnitsApi.updateAdminUnit(id, payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUnits.updateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { UpdateAdminUnit, type UpdateAdminUnitResult };
