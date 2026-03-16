import {
  fetchAdminAppointments,
  type AdminAppointmentItem,
  type ListAdminAppointmentsParams,
} from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { buildTodayDate, buildWeekRange } from "@/lib/date-helpers";
import { MESSAGES } from "@/lib/messages";

type ViewMode = "today" | "week" | "employee" | "unit";

interface LoadAppointmentsInput {
  page: number;
  pageSize: number;
  viewMode: ViewMode;
  statusFilter: string;
  employeeFilter: string;
  unitFilter: string;
}

interface AppointmentsLoadResult {
  data: { appointments: AdminAppointmentItem[]; total: number; page: number } | null;
  error: string | null;
  isAuthError: boolean;
}

function buildQueryParams(input: LoadAppointmentsInput): ListAdminAppointmentsParams {
  const params: ListAdminAppointmentsParams = {
    page: input.page,
    limit: input.pageSize,
  };

  if (input.viewMode === "today") {
    params.date = buildTodayDate();
  } else if (input.viewMode === "week") {
    const range = buildWeekRange();
    params.weekStart = range.weekStart;
    params.weekEnd = range.weekEnd;
  } else if (input.viewMode === "employee" && input.employeeFilter !== "all") {
    params.employeeId = Number(input.employeeFilter);
  } else if (input.viewMode === "unit" && input.unitFilter !== "all") {
    params.unitId = Number(input.unitFilter);
  }

  if (input.statusFilter !== "all") {
    params.status = input.statusFilter;
  }

  return params;
}

async function loadAdminAppointments(
  input: LoadAppointmentsInput,
  signal?: AbortSignal,
): Promise<AppointmentsLoadResult> {
  try {
    const params = buildQueryParams(input);
    const response = await fetchAdminAppointments(params, signal);

    return {
      data: {
        appointments: response.data,
        total: response.total,
        page: response.page,
      },
      error: null,
      isAuthError: false,
    };
  } catch (error) {
    if (signal?.aborted) {
      return { data: null, error: null, isAuthError: false };
    }
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminAppointments.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export {
  loadAdminAppointments,
  type ViewMode,
  type LoadAppointmentsInput,
  type AppointmentsLoadResult,
};
