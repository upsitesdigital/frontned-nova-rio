import {
  createAdminUnit as createAdminUnitApi,
  type AdminUnit,
  type SaveAdminUnitPayload,
} from "@/api/admin-units-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface CreateAdminUnitResult {
  data: AdminUnit | null;
  error: string | null;
  isAuthError: boolean;
}

async function createAdminUnit(payload: SaveAdminUnitPayload): Promise<CreateAdminUnitResult> {
  try {
    const data = await createAdminUnitApi(payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminUnits.createError),
      isAuthError: isAuthError(error),
    };
  }
}

export { createAdminUnit, type CreateAdminUnitResult };
