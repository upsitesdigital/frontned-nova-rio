import { deleteAdminUnit as deleteAdminUnitApi } from "@/api/admin-units-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface DeleteAdminUnitResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function deleteAdminUnit(id: number): Promise<DeleteAdminUnitResult> {
  try {
    await deleteAdminUnitApi(id);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminUnits.deleteError),
      isAuthError: isAuthError(error),
    };
  }
}

export { deleteAdminUnit, type DeleteAdminUnitResult };
