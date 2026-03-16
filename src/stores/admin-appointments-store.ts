import { create } from "zustand";

import {
  loadAdminAppointments,
  type ViewMode,
} from "@/use-cases/load-admin-appointments";
import type { AdminAppointmentItem } from "@/api/admin-appointments-api";
import {
  getActiveEmployeeOptions,
  type EmployeeOption,
} from "@/use-cases/get-active-employee-options";
import {
  getActiveServiceOptions,
  type ActiveServiceOption,
} from "@/use-cases/get-active-service-options";
import { getActiveUnitOptions, type UnitOption } from "@/use-cases/get-active-unit-options";

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

const useAdminAppointmentsStore = create<AdminAppointmentsStore>()((set, get) => ({
  ...initialState,

  loadAppointments: async () => {
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    const { page, viewMode, statusFilter, employeeFilter, unitFilter } = get();

    set({ isLoading: true, error: null });

    const result = await loadAdminAppointments(
      { page, pageSize: PAGE_SIZE, viewMode, statusFilter, employeeFilter, unitFilter },
      signal,
    );

    if (result.data) {
      set({
        appointments: result.data.appointments,
        total: result.data.total,
        page: result.data.page,
        isLoading: false,
      });
    } else if (result.error) {
      set({
        isLoading: false,
        error: result.error,
        isAuthError: result.isAuthError,
      });
    } else {
      set({ isLoading: false });
    }
  },

  loadFilterOptions: async () => {
    set({ isOptionsLoading: true });
    try {
      const [employeesResult, unitsResult, servicesResult] = await Promise.allSettled([
        getActiveEmployeeOptions(),
        getActiveUnitOptions(),
        getActiveServiceOptions(),
      ]);
      set({
        employeeOptions:
          employeesResult.status === "fulfilled" ? (employeesResult.value.data ?? []) : [],
        unitOptions: unitsResult.status === "fulfilled" ? (unitsResult.value.data ?? []) : [],
        serviceOptions:
          servicesResult.status === "fulfilled" ? (servicesResult.value.data ?? []) : [],
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

  reset: () => {
    abortController?.abort();
    abortController = null;
    set(initialState);
  },
}));

export { useAdminAppointmentsStore, PAGE_SIZE, type AdminAppointmentsStore, type ViewMode };
