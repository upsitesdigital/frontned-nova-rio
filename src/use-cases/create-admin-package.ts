import {
  createAdminPackage as createAdminPackageApi,
  type AdminPackage,
  type SaveAdminPackagePayload,
} from "@/api/admin-packages-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface CreateAdminPackageResult {
  data: AdminPackage | null;
  error: string | null;
  isAuthError: boolean;
}

async function createAdminPackage(payload: SaveAdminPackagePayload): Promise<CreateAdminPackageResult> {
  try {
    const data = await createAdminPackageApi(payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminPackages.createError),
      isAuthError: isAuthError(error),
    };
  }
}

export { createAdminPackage, type CreateAdminPackageResult };
