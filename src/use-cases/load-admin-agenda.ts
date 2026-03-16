import { fetchTodayAgenda, type AgendaItem } from "@/api/admin-dashboard-api";
import { isAuthError } from "@/lib/auth-helpers";

interface AgendaLoadResult {
  items: AgendaItem[];
  total: number;
  error: null;
  isAuthError: false;
}

interface AgendaLoadError {
  items: null;
  total: null;
  error: string | null;
  isAuthError: boolean;
}

async function loadTodayAgenda(
  page: number,
  pageSize: number,
  serviceId?: number,
  signal?: AbortSignal,
): Promise<AgendaLoadResult | AgendaLoadError> {
  try {
    const agenda = await fetchTodayAgenda(page, pageSize, serviceId, signal);
    return {
      items: agenda.items,
      total: agenda.total,
      error: null,
      isAuthError: false,
    };
  } catch (error) {
    if (signal?.aborted) {
      return { items: null, total: null, error: null, isAuthError: false };
    }
    return {
      items: null,
      total: null,
      error: null,
      isAuthError: isAuthError(error),
    };
  }
}

export { loadTodayAgenda, type AgendaLoadResult, type AgendaLoadError };
