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
  cancelOpen: boolean;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: string | null;
}

interface ServiceEditActions {
  setRecurrence: (recurrence: RecurrenceType) => void;
  initRecurrence: (recurrence: RecurrenceType) => void;
  openReschedule: (date?: Date, time?: string) => void;
  closeReschedule: () => void;
  setRescheduleDate: (date: Date | undefined) => void;
  setRescheduleTime: (time: string) => void;
  confirmReschedule: (appointmentId: number) => Promise<boolean>;
  openCancel: () => void;
  closeCancel: () => void;
  confirmCancel: (appointmentId: number) => Promise<boolean>;
  reset: () => void;
}

type ServiceEditStore = ServiceEditState & ServiceEditActions;

const initialState: ServiceEditState = {
  recurrence: "SINGLE",
  rescheduleOpen: false,
  rescheduleDate: undefined,
  rescheduleTime: undefined,
  cancelOpen: false,
  isSaving: false,
  saveError: null,
  saveSuccess: null,
};

const useServiceEditStore = create<ServiceEditStore>()((set, get) => ({
  ...initialState,

  setRecurrence: (recurrence) => set({ recurrence }),

  initRecurrence: (recurrence) => set({ recurrence }),

  openReschedule: (date?: Date, time?: string) =>
    set({ rescheduleOpen: true, rescheduleDate: date ?? new Date(), rescheduleTime: time }),

  closeReschedule: () => set({ rescheduleOpen: false }),

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

    set({ isSaving: true, saveError: null, saveSuccess: null });

    try {
      await rescheduleAppointment(token, appointmentId, {
        date: format(rescheduleDate, "yyyy-MM-dd"),
        startTime: rescheduleTime,
      });
      set({
        isSaving: false,
        rescheduleOpen: false,
        rescheduleDate: undefined,
        rescheduleTime: undefined,
        saveSuccess: "Agendamento atualizado com sucesso!",
      });
      return true;
    } catch (error) {
      const message =
        error instanceof HttpClientError && error.status === 401
          ? "Sessão expirada. Faça login novamente."
          : error instanceof HttpClientError
            ? error.message
            : "Erro ao reagendar. Tente novamente.";
      set({ isSaving: false, saveError: message });
      return false;
    }
  },

  openCancel: () => set({ cancelOpen: true, saveError: null }),

  closeCancel: () => set({ cancelOpen: false }),

  confirmCancel: async (appointmentId) => {
    await waitForAuthHydration();

    const token = useAuthStore.getState().accessToken;
    if (!token) {
      set({ saveError: "Sessão expirada. Faça login novamente." });
      return false;
    }

    set({ isSaving: true, saveError: null, saveSuccess: null });

    try {
      await cancelAppointment(token, appointmentId);
      set({
        isSaving: false,
        cancelOpen: false,
        saveSuccess: "Agendamento cancelado com sucesso!",
      });
      return true;
    } catch (error) {
      const message =
        error instanceof HttpClientError && error.status === 401
          ? "Sessão expirada. Faça login novamente."
          : error instanceof HttpClientError
            ? error.message
            : "Erro ao cancelar. Tente novamente.";
      set({ isSaving: false, saveError: message });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useServiceEditStore, type ServiceEditStore, type RecurrenceType };
