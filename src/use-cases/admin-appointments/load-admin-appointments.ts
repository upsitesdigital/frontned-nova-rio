import {
  AdminAppointmentsApi,
  type AdminAppointmentItem,
  type ListAdminAppointmentsParams,
} from "@/api/admin/admin-appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { DateHelpers } from "@/lib/formatting/date-helpers";
import { Messages } from "@/lib/core/messages";

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
    params.date = DateHelpers.buildTodayDate();
  } else if (input.viewMode === "week") {
    const range = DateHelpers.buildWeekRange();
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

class LoadAdminAppointments {
  static async loadAdminAppointments(
    input: LoadAppointmentsInput,
    signal?: AbortSignal,
  ): Promise<AppointmentsLoadResult> {
    try {
      const params = buildQueryParams(input);
      const response = await AdminAppointmentsApi.fetchAdminAppointments(params, signal);

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
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminAppointments.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  LoadAdminAppointments,
  type ViewMode,
  type LoadAppointmentsInput,
  type AppointmentsLoadResult,
};
