import { create } from "zustand";
import { loadEmployeeBusyDates } from "@/use-cases/load-employee-busy-dates";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

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
    set({ open: false, employeeId: null, employeeName: "", busyDates: [] });
  },

  setCurrentMonth: (date: Date) => {
    set({ currentMonth: date });
    get().loadBusyDates();
  },

  loadBusyDates: async () => {
    const { employeeId, currentMonth } = get();
    if (!employeeId) return;

    set({ isLoading: true, error: null });

    try {
      const dates = await loadEmployeeBusyDates({ employeeId, currentMonth });
      set({ busyDates: dates, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: resolveErrorMessage(error, MESSAGES.adminEmployees.scheduleError),
        isAuthError: isAuthError(error),
      });
    }
  },
}));

export { useAdminEmployeeScheduleStore, type AdminEmployeeScheduleStore };
