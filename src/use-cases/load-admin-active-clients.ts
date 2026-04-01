import {
  fetchAdminActiveClients,
  type AdminActiveClientsByUnit,
} from "@/api/admin-reports-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminActiveClientsInput {
  unitId?: number;
  signal?: AbortSignal;
}

interface AdminActiveClientsData {
  totalActive: number;
  byUnit: AdminActiveClientsByUnit[];
}

interface LoadAdminActiveClientsResult {
  data: AdminActiveClientsData | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminActiveClients(
  input: LoadAdminActiveClientsInput,
): Promise<LoadAdminActiveClientsResult> {
  try {
    const response = await fetchAdminActiveClients({ unitId: input.unitId }, input.signal);

    return {
      data: {
        totalActive: response.totalActive,
        byUnit: response.byUnit,
      },
      error: null,
      isAuthError: false,
    };
  } catch (error) {
    if (input.signal?.aborted) {
      return { data: null, error: null, isAuthError: false };
    }

    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminReports.activeClientsLoadError),
      isAuthError: isAuthError(error),
    };
  }
}

export {
  loadAdminActiveClients,
  type LoadAdminActiveClientsInput,
  type AdminActiveClientsData,
  type LoadAdminActiveClientsResult,
};