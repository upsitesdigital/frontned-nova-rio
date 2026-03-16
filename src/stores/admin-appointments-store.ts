import { create } from "zustand";
import { format, startOfWeek, endOfWeek } from "date-fns";

import {
  fetchAdminAppointments,
  fetchEmployeeOptions,
  fetchUnitOptions,
  type AdminAppointmentItem,
  type EmployeeOption,
  type UnitOption,
} from "@/api/admin-appointments-api";
import { isAuthError as checkAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";
import {
  getActiveServiceOptions,
  type ActiveServiceOption,
} from "@/use-cases/get-active-service-options";

type ViewMode = "today" | "week" | "employee" | "unit";

interface AdminAppointmentsState {
  appointments: AdminAppointmentItem[];
  total: number;
  page: number;
  viewMode: ViewMode;
  statusFilter: string;
  employeeFilter: string;
  unitFilter: string;
  employeeOptions: EmployeeOption[];
  unitOptions: UnitOption[];
  serviceOptions: ActiveServiceOption[];
  isLoading: boolean;
  isOptionsLoading: boolean;
  error: string | null;
  isAuthError: boolean;
}

interface AdminAppointmentsActions {
  loadAppointments: () => Promise<void>;
  loadFilterOptions: () => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setStatusFilter: (value: string) => void;
  setEmployeeFilter: (value: string) => void;
  setUnitFilter: (value: string) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

type AdminAppointmentsStore = AdminAppointmentsState & AdminAppointmentsActions;

const PAGE_SIZE = 10;

const initialState: AdminAppointmentsState = {
  appointments: [],
  total: 0,
  page: 1,
  viewMode: "today",
  statusFilter: "all",
  employeeFilter: "all",
  unitFilter: "all",
  employeeOptions: [],
  unitOptions: [],
  serviceOptions: [],
  isLoading: false,
  isOptionsLoading: false,
  error: null,
  isAuthError: false,
};

let abortController: AbortController | null = null;

function buildTodayDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function buildWeekRange(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  return {
    weekStart: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    weekEnd: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  };
}

const useAdminAppointmentsStore = create<AdminAppointmentsStore>()((set, get) => ({
  ...initialState,

  loadAppointments: async () => {
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    const { page, viewMode, statusFilter, employeeFilter, unitFilter } = get();

    set({ isLoading: true, error: null });

    const params: Record<string, string | number | undefined> = {
      page,
      limit: PAGE_SIZE,
    };

    if (viewMode === "today") {
      params.date = buildTodayDate();
    } else if (viewMode === "week") {
      const range = buildWeekRange();
      params.weekStart = range.weekStart;
      params.weekEnd = range.weekEnd;
    } else if (viewMode === "employee" && employeeFilter !== "all") {
      params.employeeId = Number(employeeFilter);
    } else if (viewMode === "unit" && unitFilter !== "all") {
      params.unitId = Number(unitFilter);
    }

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    try {
      const response = await fetchAdminAppointments(
        {
          page: params.page as number,
          limit: params.limit as number,
          date: params.date as string | undefined,
          weekStart: params.weekStart as string | undefined,
          weekEnd: params.weekEnd as string | undefined,
          employeeId: params.employeeId as number | undefined,
          unitId: params.unitId as number | undefined,
          status: params.status as string | undefined,
        },
        signal,
      );

      set({
        appointments: response.data,
        total: response.total,
        page: response.page,
        isLoading: false,
      });
    } catch (error) {
      if (signal.aborted) return;
      set({
        isLoading: false,
        error: resolveErrorMessage(error, MESSAGES.adminAppointments.loadError),
        isAuthError: checkAuthError(error),
      });
    }
  },

  loadFilterOptions: async () => {
    set({ isOptionsLoading: true });
    try {
      const [employees, units, services] = await Promise.allSettled([
        fetchEmployeeOptions(),
        fetchUnitOptions(),
        getActiveServiceOptions(),
      ]);
      set({
        employeeOptions: employees.status === "fulfilled" ? employees.value : [],
        unitOptions: units.status === "fulfilled" ? units.value : [],
        serviceOptions: services.status === "fulfilled" ? services.value : [],
        isOptionsLoading: false,
      });
    } catch {
      set({ isOptionsLoading: false });
    }
  },

  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode, page: 1, employeeFilter: "all", unitFilter: "all" });
    get().loadAppointments();
  },

  setStatusFilter: (value: string) => {
    set({ statusFilter: value, page: 1 });
    get().loadAppointments();
  },

  setEmployeeFilter: (value: string) => {
    set({ employeeFilter: value, page: 1 });
    get().loadAppointments();
  },

  setUnitFilter: (value: string) => {
    set({ unitFilter: value, page: 1 });
    get().loadAppointments();
  },

  setPage: (page: number) => {
    set({ page });
    get().loadAppointments();
  },

  reset: () => set(initialState),
}));

export { useAdminAppointmentsStore, PAGE_SIZE, type AdminAppointmentsStore, type ViewMode };
