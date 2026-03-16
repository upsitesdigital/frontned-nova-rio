import { create } from "zustand";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { fetchAdminAppointments } from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";

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

    const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    set({ isLoading: true, error: null });

    try {
      const response = await fetchAdminAppointments({
        page: 1,
        limit: 100,
        employeeId,
        weekStart: monthStart,
        weekEnd: monthEnd,
        status: "SCHEDULED",
      });

      const dates = response.data.map((item) => new Date(item.date));
      set({ busyDates: dates, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: resolveErrorMessage(error, "Erro ao carregar agenda"),
        isAuthError: isAuthError(error),
      });
    }
  },
}));

export { useAdminEmployeeScheduleStore, type AdminEmployeeScheduleStore };
