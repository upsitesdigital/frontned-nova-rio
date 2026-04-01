import {
  updateAdminUnit as updateAdminUnitApi,
  type AdminUnit,
  type SaveAdminUnitPayload,
} from "@/api/admin-units-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface UpdateAdminUnitResult {
  data: AdminUnit | null;
  error: string | null;
  isAuthError: boolean;
}

async function updateAdminUnit(
  id: number,
  payload: Partial<SaveAdminUnitPayload>,
): Promise<UpdateAdminUnitResult> {
  try {
    const data = await updateAdminUnitApi(id, payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminUnits.updateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { updateAdminUnit, type UpdateAdminUnitResult };
