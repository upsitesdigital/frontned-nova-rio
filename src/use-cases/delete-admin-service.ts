import { deleteAdminService as deleteAdminServiceApi } from "@/api/admin-services-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface DeleteAdminServiceResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function deleteAdminService(id: number): Promise<DeleteAdminServiceResult> {
  try {
    await deleteAdminServiceApi(id);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminServices.deleteError),
      isAuthError: isAuthError(error),
    };
  }
}

export { deleteAdminService, type DeleteAdminServiceResult };
