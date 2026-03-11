import { create } from "zustand";
import { format } from "date-fns";

import { cancelAppointment, rescheduleAppointment } from "@/api/appointments-api";
import { HttpClientError } from "@/api/http-client";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";

type RecurrenceType = "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

interface ServiceEditState {
  recurrence: RecurrenceType;
  rescheduleOpen: boolean;
  rescheduleDate: Date | undefined;
  rescheduleTime: string | undefined;
  isSaving: boolean;
  saveError: string | null;
}

interface ServiceEditActions {
  setRecurrence: (recurrence: RecurrenceType) => void;
  initRecurrence: (recurrence: RecurrenceType) => void;
  openReschedule: () => void;
  closeReschedule: () => void;
  setRescheduleDate: (date: Date | undefined) => void;
  setRescheduleTime: (time: string) => void;
  confirmReschedule: (appointmentId: number) => Promise<boolean>;
  cancelAppointment: (appointmentId: number) => Promise<boolean>;
  reset: () => void;
}

type ServiceEditStore = ServiceEditState & ServiceEditActions;

const initialState: ServiceEditState = {
  recurrence: "SINGLE",
  rescheduleOpen: false,
  rescheduleDate: undefined,
  rescheduleTime: undefined,
  isSaving: false,
  saveError: null,
};

const useServiceEditStore = create<ServiceEditStore>()((set, get) => ({
  ...initialState,

  setRecurrence: (recurrence) => set({ recurrence }),

  initRecurrence: (recurrence) => set({ recurrence }),

  openReschedule: () => set({ rescheduleOpen: true, rescheduleDate: new Date() }),

  closeReschedule: () =>
    set({ rescheduleOpen: false, rescheduleDate: undefined, rescheduleTime: undefined }),

  setRescheduleDate: (date) => set({ rescheduleDate: date }),

  setRescheduleTime: (time) => set({ rescheduleTime: time }),

  confirmReschedule: async (appointmentId) => {
    await waitForAuthHydration();

    const token = useAuthStore.getState().accessToken;
    if (!token) {
      set({ saveError: "Sessao expirada. Faca login novamente." });
      return false;
    }

    const { rescheduleDate, rescheduleTime } = get();
    if (!rescheduleDate || !rescheduleTime) {
      set({ saveError: "Selecione a data e o horario." });
      return false;
    }

    set({ isSaving: true, saveError: null });

    try {
      await rescheduleAppointment(token, appointmentId, {
        date: format(rescheduleDate, "yyyy-MM-dd"),
        startTime: rescheduleTime,
      });
      set({ isSaving: false, rescheduleOpen: false, rescheduleDate: undefined, rescheduleTime: undefined });
      return true;
    } catch (error) {
      const message =
        error instanceof HttpClientError
          ? error.message
          : "Erro ao reagendar. Tente novamente.";
      set({ isSaving: false, saveError: message });
      return false;
    }
  },

  cancelAppointment: async (appointmentId) => {
    await waitForAuthHydration();

    const token = useAuthStore.getState().accessToken;
    if (!token) {
      set({ saveError: "Sessao expirada. Faca login novamente." });
      return false;
    }

    set({ isSaving: true, saveError: null });

    try {
      await cancelAppointment(token, appointmentId);
      set({ isSaving: false });
      return true;
    } catch (error) {
      const message =
        error instanceof HttpClientError
          ? error.message
          : "Erro ao cancelar. Tente novamente.";
      set({ isSaving: false, saveError: message });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useServiceEditStore, type ServiceEditStore, type RecurrenceType };
