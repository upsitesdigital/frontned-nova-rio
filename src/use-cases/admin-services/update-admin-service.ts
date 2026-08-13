import {
  AdminServicesApi,
  type AdminService,
  type SaveAdminServicePayload,
} from "@/api/admin/admin-services-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface UpdateAdminServiceResult {
  data: AdminService | null;
  error: string | null;
  isAuthError: boolean;
}

class UpdateAdminService {
  static async updateAdminService(
    id: number,
    payload: SaveAdminServicePayload,
  ): Promise<UpdateAdminServiceResult> {
    try {
      const data = await AdminServicesApi.updateAdminService(id, payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminServices.updateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { UpdateAdminService, type UpdateAdminServiceResult };
