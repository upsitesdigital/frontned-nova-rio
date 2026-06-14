import { create } from "zustand";
import { LoadEmployeeBusyDates } from "@/use-cases/admin-employees/load-employee-busy-dates";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface AdminEmployeeScheduleState {
  open: boolean;
  employeeId: number | null;
  employeeName: string;
  currentMonth: Date;
  busyDates: Date[];
  isLoading: boolean;
  error: string | null;
  isAuthError: boolean;
}

interface AdminEmployeeScheduleActions {
  openSchedule: (employeeId: number, employeeName: string) => void;
  closeSchedule: () => void;
  setCurrentMonth: (date: Date) => void;
  loadBusyDates: () => Promise<void>;
}

type AdminEmployeeScheduleStore = AdminEmployeeScheduleState & AdminEmployeeScheduleActions;
let scheduleBusyDatesSeq = 0;

const useAdminEmployeeScheduleStore = create<AdminEmployeeScheduleStore>((set, get) => ({
  open: false,
  employeeId: null,
  employeeName: "",
  currentMonth: new Date(),
  busyDates: [],
  isLoading: false,
  error: null,
  isAuthError: false,

  openSchedule: (employeeId: number, employeeName: string) => {
    set({
      open: true,
      employeeId,
      employeeName,
      currentMonth: new Date(),
      busyDates: [],
      error: null,
      isAuthError: false,
    });
    get().loadBusyDates();
  },

  closeSchedule: () => {
    scheduleBusyDatesSeq++;
    set({ open: false, employeeId: null, employeeName: "", busyDates: [] });
  },

  setCurrentMonth: (date: Date) => {
    set({ currentMonth: date });
    get().loadBusyDates();
  },

  loadBusyDates: async () => {
    const { employeeId, currentMonth } = get();
    if (!employeeId) return;
    const seq = ++scheduleBusyDatesSeq;

    set({ isLoading: true, error: null });

    try {
      const dates = await LoadEmployeeBusyDates.loadEmployeeBusyDates({ employeeId, currentMonth });
      if (seq !== scheduleBusyDatesSeq) return;
      set({ busyDates: dates, isLoading: false });
    } catch (error) {
      if (seq !== scheduleBusyDatesSeq) return;
      set({
        isLoading: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminEmployees.scheduleError),
        isAuthError: AuthHelpers.isAuthError(error),
      });
    }
  },
}));

export { useAdminEmployeeScheduleStore, type AdminEmployeeScheduleStore };
