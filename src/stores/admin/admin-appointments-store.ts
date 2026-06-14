import { create } from "zustand";

import {
  LoadAdminAppointments,
  type ViewMode,
} from "@/use-cases/admin-appointments/load-admin-appointments";
import type { AdminAppointmentItem } from "@/api/admin/admin-appointments-api";
import {
  GetActiveEmployeeOptions,
  type EmployeeOption,
} from "@/use-cases/admin-employees/get-active-employee-options";
import {
  GetActiveServiceOptions,
  type ActiveServiceOption,
} from "@/use-cases/admin-services/get-active-service-options";
import {
  GetActiveUnitOptions,
  type UnitOption,
} from "@/use-cases/admin-units/get-active-unit-options";
import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import { CancelAdminAppointment } from "@/use-cases/admin-appointments/cancel-admin-appointment";
import { CompleteAdminAppointment } from "@/use-cases/admin-appointments/complete-admin-appointment";
import { RescheduleAdminAppointment } from "@/use-cases/admin-appointments/reschedule-admin-appointment";
import { UpdateAdminAppointment } from "@/use-cases/admin-appointments/update-admin-appointment";

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
  selectedAppointment: AdminAppointmentItem | null;
  viewOpen: boolean;
  editOpen: boolean;
  rescheduleOpen: boolean;
  cancelOpen: boolean;
  completeOpen: boolean;
  editClientId: string;
  editEmployeeId: string;
  rescheduleDate: string;
  rescheduleTime: string;
  actionError: string | null;
  isSubmitting: boolean;
}

interface AdminAppointmentsActions {
  loadAppointments: () => Promise<void>;
  loadFilterOptions: () => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setStatusFilter: (value: string) => void;
  setEmployeeFilter: (value: string) => void;
  setUnitFilter: (value: string) => void;
  setPage: (page: number) => void;
  setViewOpen: (open: boolean) => void;
  setEditOpen: (open: boolean) => void;
  setRescheduleOpen: (open: boolean) => void;
  setCancelOpen: (open: boolean) => void;
  setCompleteOpen: (open: boolean) => void;
  setEditClientId: (value: string) => void;
  setEditEmployeeId: (value: string) => void;
  setRescheduleDate: (value: string) => void;
  setRescheduleTime: (value: string) => void;
  resetActionError: () => void;
  openViewDialog: (appointment: AdminAppointmentItem) => void;
  openEditDialog: (appointment: AdminAppointmentItem) => void;
  saveEdit: () => Promise<void>;
  reschedule: () => Promise<void>;
  cancelAppointment: () => Promise<void>;
  completeAppointment: () => Promise<void>;
  reset: () => void;
}

type AdminAppointmentsStore = AdminAppointmentsState & AdminAppointmentsActions;

const pageSize = 10;

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
  selectedAppointment: null,
  viewOpen: false,
  editOpen: false,
  rescheduleOpen: false,
  cancelOpen: false,
  completeOpen: false,
  editClientId: "",
  editEmployeeId: "",
  rescheduleDate: "",
  rescheduleTime: "",
  actionError: null,
  isSubmitting: false,
};

function normalizeTimeValue(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

let abortController: AbortController | null = null;

const useAdminAppointmentsStore = create<AdminAppointmentsStore>()((set, get) => ({
  ...initialState,

  loadAppointments: async () => {
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    const { page, viewMode, statusFilter, employeeFilter, unitFilter } = get();

    set({ isLoading: true, error: null });

    const result = await LoadAdminAppointments.loadAdminAppointments(
      { page, pageSize: pageSize, viewMode, statusFilter, employeeFilter, unitFilter },
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
        GetActiveEmployeeOptions.getActiveEmployeeOptions(),
        GetActiveUnitOptions.getActiveUnitOptions(),
        GetActiveServiceOptions.getActiveServiceOptions(),
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

  setViewOpen: (open) => {
    set({ viewOpen: open });
    if (!open) set({ actionError: null });
  },

  setEditOpen: (open) => {
    set({ editOpen: open });
    if (!open) set({ actionError: null, rescheduleOpen: false });
  },

  setRescheduleOpen: (open) => {
    set({ rescheduleOpen: open });
  },

  setCancelOpen: (open) => {
    set({ cancelOpen: open });
  },

  setCompleteOpen: (open) => {
    set({ completeOpen: open });
  },

  setEditClientId: (value) => {
    set({ editClientId: value });
  },

  setEditEmployeeId: (value) => {
    set({ editEmployeeId: value });
  },

  setRescheduleDate: (value) => {
    set({ rescheduleDate: value });
  },

  setRescheduleTime: (value) => {
    set({ rescheduleTime: value });
  },

  resetActionError: () => {
    set({ actionError: null });
  },

  openViewDialog: (appointment) => {
    set({ selectedAppointment: appointment, actionError: null, viewOpen: true });
  },

  openEditDialog: (appointment) => {
    set({
      selectedAppointment: appointment,
      editClientId: String(appointment.client.id),
      editEmployeeId: appointment.employee ? String(appointment.employee.id) : "",
      rescheduleDate: appointment.date,
      rescheduleTime: normalizeTimeValue(appointment.startTime),
      actionError: null,
      editOpen: true,
    });
  },

  saveEdit: async () => {
    const { selectedAppointment, editEmployeeId } = get();
    if (!selectedAppointment) return;

    const nextEmployeeId = editEmployeeId ? Number(editEmployeeId) : undefined;
    const currentEmployeeId = selectedAppointment.employee?.id;

    if (currentEmployeeId === nextEmployeeId) {
      set({ editOpen: false });
      return;
    }

    set({ isSubmitting: true, actionError: null });

    const result = await UpdateAdminAppointment.saveAdminAppointment({
      id: selectedAppointment.id,
      employeeId: nextEmployeeId,
    });

    set({ isSubmitting: false });

    if (!result.success) {
      set({ actionError: result.error ?? Messages.adminAppointments.updateError });
      return;
    }

    set({ editOpen: false });
    await get().loadAppointments();
    useToastStore.getState().showToast(Messages.adminAppointments.updateSuccess, "success");
  },

  reschedule: async () => {
    const { selectedAppointment, rescheduleDate, rescheduleTime } = get();
    if (!selectedAppointment) return;

    if (!rescheduleDate || !rescheduleTime) {
      set({ actionError: "Informe a nova data e o novo horario." });
      return;
    }

    set({ isSubmitting: true, actionError: null });

    const result = await RescheduleAdminAppointment.rescheduleAppointment({
      id: selectedAppointment.id,
      date: rescheduleDate,
      startTime: rescheduleTime,
    });

    set({ isSubmitting: false });

    if (!result.success) {
      set({ actionError: result.error ?? Messages.adminAppointments.rescheduleError });
      return;
    }

    set({ rescheduleOpen: false, editOpen: false });
    await get().loadAppointments();
    useToastStore.getState().showToast(Messages.adminAppointments.rescheduleSuccess, "success");
  },

  cancelAppointment: async () => {
    const { selectedAppointment } = get();
    if (!selectedAppointment) return;

    set({ isSubmitting: true, actionError: null });
    const result = await CancelAdminAppointment.cancelAppointment(selectedAppointment.id);
    set({ isSubmitting: false });

    if (!result.success) {
      set({ actionError: result.error ?? Messages.adminAppointments.cancelError });
      return;
    }

    set({ cancelOpen: false, editOpen: false });
    await get().loadAppointments();
    useToastStore.getState().showToast(Messages.adminAppointments.cancelSuccess, "success");
  },

  completeAppointment: async () => {
    const { selectedAppointment } = get();
    if (!selectedAppointment) return;

    set({ isSubmitting: true, actionError: null });
    const result = await CompleteAdminAppointment.completeAppointment(selectedAppointment.id);
    set({ isSubmitting: false });

    if (!result.success) {
      set({ actionError: result.error ?? Messages.adminAppointments.completeError });
      return;
    }

    set({ completeOpen: false, editOpen: false });
    await get().loadAppointments();
    useToastStore.getState().showToast(Messages.adminAppointments.completeSuccess, "success");
  },

  reset: () => {
    abortController?.abort();
    abortController = null;
    set(initialState);
  },
}));

export { useAdminAppointmentsStore, pageSize, type AdminAppointmentsStore, type ViewMode };
