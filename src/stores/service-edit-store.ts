import { create } from "zustand";

import { fetchReceiptBlob } from "@/api/receipts-api";
import { triggerBlobDownload } from "@/lib/download-helpers";
import { MESSAGES } from "@/lib/messages";
import { cancelClientAppointment } from "@/use-cases/cancel-client-appointment";
import { rescheduleClientAppointment } from "@/use-cases/reschedule-client-appointment";

type RecurrenceType = "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

interface ServiceEditState {
  recurrence: RecurrenceType;
  rescheduleOpen: boolean;
  rescheduleDate: Date | undefined;
  rescheduleTime: string | undefined;
  cancelOpen: boolean;
  addressSectionOpen: boolean;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: string | null;
}

interface ServiceEditActions {
  setAddressSectionOpen: (open: boolean) => void;
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
  downloadServiceReceipt: (paymentId: number) => Promise<void>;
  reset: () => void;
}

type ServiceEditStore = ServiceEditState & ServiceEditActions;

const initialState: ServiceEditState = {
  recurrence: "SINGLE",
  addressSectionOpen: true,
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

  setAddressSectionOpen: (open) => set({ addressSectionOpen: open }),
  setRecurrence: (recurrence) => set({ recurrence }),

  initRecurrence: (recurrence) => set({ recurrence }),

  openReschedule: (date?: Date, time?: string) =>
    set({ rescheduleOpen: true, rescheduleDate: date ?? new Date(), rescheduleTime: time }),

  closeReschedule: () => set({ rescheduleOpen: false }),

  setRescheduleDate: (date) => set({ rescheduleDate: date }),

  setRescheduleTime: (time) => set({ rescheduleTime: time }),

  confirmReschedule: async (appointmentId) => {
    const { rescheduleDate, rescheduleTime } = get();
    if (!rescheduleDate || !rescheduleTime) {
      set({ saveError: MESSAGES.appointments.selectDateTime });
      return false;
    }

    set({ isSaving: true, saveError: null, saveSuccess: null });

    const result = await rescheduleClientAppointment({
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
        saveSuccess: MESSAGES.appointments.rescheduleSuccess,
      });
      return true;
    }

    set({ isSaving: false, saveError: result.error });
    return false;
  },

  openCancel: () => set({ cancelOpen: true, saveError: null }),

  closeCancel: () => set({ cancelOpen: false }),

  confirmCancel: async (appointmentId) => {
    set({ isSaving: true, saveError: null, saveSuccess: null });

    const result = await cancelClientAppointment(appointmentId);

    if (result.success) {
      set({
        isSaving: false,
        cancelOpen: false,
        saveSuccess: MESSAGES.appointments.cancelSuccess,
      });
      return true;
    }

    set({ isSaving: false, saveError: result.error });
    return false;
  },

  downloadServiceReceipt: async (paymentId) => {
    const blob = await fetchReceiptBlob(paymentId);
    triggerBlobDownload(blob, `recibo-${paymentId}.pdf`);
  },

  reset: () => set(initialState),
}));

export { useServiceEditStore, type ServiceEditStore, type RecurrenceType };
