import { create } from "zustand";

import { Messages } from "@/lib/core/messages";
import { CancelClientAppointment } from "@/use-cases/client-appointments/cancel-client-appointment";
import { RescheduleClientAppointment } from "@/use-cases/client-appointments/reschedule-client-appointment";

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
    if (get().isSaving) return false;
    const { rescheduleDate, rescheduleTime } = get();
    if (!rescheduleDate || !rescheduleTime) {
      set({ saveError: Messages.appointments.selectDateTime });
      return false;
    }

    set({ isSaving: true, saveError: null, saveSuccess: null });

    const result = await RescheduleClientAppointment.rescheduleClientAppointment({
      appointmentId,
      date: rescheduleDate,
      time: rescheduleTime,
    });

    if (result.success) {
      set({
        isSaving: false,
        rescheduleOpen: false,
        rescheduleDate: undefined,
        rescheduleTime: undefined,
        saveSuccess: Messages.appointments.rescheduleSuccess,
      });
      return true;
    }

    set({ isSaving: false, saveError: result.error });
    return false;
  },

  openCancel: () => set({ cancelOpen: true, saveError: null }),

  closeCancel: () => set({ cancelOpen: false }),

  confirmCancel: async (appointmentId) => {
    if (get().isSaving) return false;
    set({ isSaving: true, saveError: null, saveSuccess: null });

    const result = await CancelClientAppointment.cancelClientAppointment(appointmentId);

    if (result.success) {
      set({
        isSaving: false,
        cancelOpen: false,
        saveSuccess: Messages.appointments.cancelSuccess,
      });
      return true;
    }

    set({ isSaving: false, saveError: result.error });
    return false;
  },

  reset: () => set(initialState),
}));

export { useSidePanelRescheduleStore, type SidePanelRescheduleStore };
