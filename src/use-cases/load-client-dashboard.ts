import { fetchClientDashboardSummary, type ClientDashboardSummary } from "@/api/dashboard-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface ClientDashboardResult {
  data: ClientDashboardSummary | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadClientDashboard(): Promise<ClientDashboardResult> {
  try {
    const data = await fetchClientDashboardSummary();
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.dashboard.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadClientDashboard, type ClientDashboardResult };
