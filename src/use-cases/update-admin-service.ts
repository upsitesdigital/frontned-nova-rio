import {
  updateAdminService as updateAdminServiceApi,
  type AdminService,
  type SaveAdminServicePayload,
} from "@/api/admin-services-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface UpdateAdminServiceResult {
  data: AdminService | null;
  error: string | null;
  isAuthError: boolean;
}

async function updateAdminService(
  id: number,
  payload: SaveAdminServicePayload,
): Promise<UpdateAdminServiceResult> {
  try {
    const data = await updateAdminServiceApi(id, payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminServices.updateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { updateAdminService, type UpdateAdminServiceResult };
