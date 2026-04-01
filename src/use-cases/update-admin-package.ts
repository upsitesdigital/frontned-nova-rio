import {
  updateAdminPackage as updateAdminPackageApi,
  type AdminPackage,
  type SaveAdminPackagePayload,
} from "@/api/admin-packages-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface UpdateAdminPackageResult {
  data: AdminPackage | null;
  error: string | null;
  isAuthError: boolean;
}

async function updateAdminPackage(
  id: number,
  payload: Partial<SaveAdminPackagePayload>,
): Promise<UpdateAdminPackageResult> {
  try {
    const data = await updateAdminPackageApi(id, payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminPackages.updateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { updateAdminPackage, type UpdateAdminPackageResult };
