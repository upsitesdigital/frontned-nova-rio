import {
  AdminUnitsApi,
  type AdminUnit,
  type SaveAdminUnitPayload,
} from "@/api/admin/admin-units-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CreateAdminUnitResult {
  data: AdminUnit | null;
  error: string | null;
  isAuthError: boolean;
}

class CreateAdminUnit {
  static async createAdminUnit(payload: SaveAdminUnitPayload): Promise<CreateAdminUnitResult> {
    try {
      const data = await AdminUnitsApi.createAdminUnit(payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUnits.createError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CreateAdminUnit, type CreateAdminUnitResult };
