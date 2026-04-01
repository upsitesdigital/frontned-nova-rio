import {
  createAdminService as createAdminServiceApi,
  type AdminService,
  type SaveAdminServicePayload,
} from "@/api/admin-services-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface CreateAdminServiceResult {
  data: AdminService | null;
  error: string | null;
  isAuthError: boolean;
}

async function createAdminService(payload: SaveAdminServicePayload): Promise<CreateAdminServiceResult> {
  try {
    const data = await createAdminServiceApi(payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminServices.createError),
      isAuthError: isAuthError(error),
    };
  }
}

export { createAdminService, type CreateAdminServiceResult };
