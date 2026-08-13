import {
  AdminServicesApi,
  type AdminService,
  type SaveAdminServicePayload,
} from "@/api/admin/admin-services-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CreateAdminServiceResult {
  data: AdminService | null;
  error: string | null;
  isAuthError: boolean;
}

class CreateAdminService {
  static async createAdminService(
    payload: SaveAdminServicePayload,
  ): Promise<CreateAdminServiceResult> {
    try {
      const data = await AdminServicesApi.createAdminService(payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminServices.createError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CreateAdminService, type CreateAdminServiceResult };
