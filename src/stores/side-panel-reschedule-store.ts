import { create } from "zustand";
import { format } from "date-fns";

import { cancelAppointment, rescheduleAppointment } from "@/api/appointments-api";
import { getAuthToken, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface SidePanelRescheduleState {
  rescheduleOpen: boolean;
  rescheduleDate: Date | undefined;
  rescheduleTime: string | undefined;
  cancelOpen: boolean;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: string | null;
}

interface SidePanelRescheduleActions {
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

type SidePanelRescheduleStore = SidePanelRescheduleState & SidePanelRescheduleActions;

const initialState: SidePanelRescheduleState = {
  rescheduleOpen: false,
  rescheduleDate: undefined,
  rescheduleTime: undefined,
  cancelOpen: false,
  isSaving: false,
  saveError: null,
  saveSuccess: null,
};

const useSidePanelRescheduleStore = create<SidePanelRescheduleStore>()((set, get) => ({
  ...initialState,

  openReschedule: (date?: Date, time?: string) =>
    set({
      rescheduleOpen: true,
      rescheduleDate: date ?? new Date(),
      rescheduleTime: time,
      saveError: null,
    }),

  closeReschedule: () =>
    set({ rescheduleOpen: false, rescheduleDate: undefined, rescheduleTime: undefined }),

  setRescheduleDate: (date) => set({ rescheduleDate: date }),

  setRescheduleTime: (time) => set({ rescheduleTime: time }),

  confirmReschedule: async (appointmentId) => {
    const token = await getAuthToken();
    if (!token) {
      set({ saveError: MESSAGES.auth.sessionExpired });
      return false;
    }

    const { rescheduleDate, rescheduleTime } = get();
    if (!rescheduleDate || !rescheduleTime) {
      set({ saveError: MESSAGES.appointments.selectDateTime });
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
        saveSuccess: MESSAGES.appointments.rescheduleSuccess,
      });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        saveError: resolveErrorMessage(error, MESSAGES.appointments.rescheduleError),
      });
      return false;
    }
  },

  openCancel: () => set({ cancelOpen: true, saveError: null }),

  closeCancel: () => set({ cancelOpen: false }),

  confirmCancel: async (appointmentId) => {
    const token = await getAuthToken();
    if (!token) {
      set({ saveError: MESSAGES.auth.sessionExpired });
      return false;
    }

    set({ isSaving: true, saveError: null, saveSuccess: null });

    try {
      await cancelAppointment(token, appointmentId);
      set({
        isSaving: false,
        cancelOpen: false,
        saveSuccess: MESSAGES.appointments.cancelSuccess,
      });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        saveError: resolveErrorMessage(error, MESSAGES.appointments.cancelError),
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useSidePanelRescheduleStore, type SidePanelRescheduleStore };
