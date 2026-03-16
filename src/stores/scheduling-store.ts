import { create } from "zustand";

import type { RecurrenceFrequency, RecurrenceType, TimeSlot } from "@/types/scheduling";
import { loadTimeSlots } from "@/use-cases/load-time-slots";

interface SchedulingState {
  recurrenceType: RecurrenceType | null;
  recurrenceFrequency: RecurrenceFrequency | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  timeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
  error: string | null;
}

interface SchedulingActions {
  setRecurrenceType: (type: RecurrenceType) => void;
  setRecurrenceFrequency: (frequency: RecurrenceFrequency) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  loadTimeSlots: (date: string) => Promise<void>;
  reset: () => void;
}

type SchedulingStore = SchedulingState & SchedulingActions;

const initialState: SchedulingState = {
  recurrenceType: null,
  recurrenceFrequency: null,
  selectedDate: null,
  selectedTime: null,
  timeSlots: [],
  isLoadingTimeSlots: false,
  error: null,
};

const useSchedulingStore = create<SchedulingStore>()((set) => ({
  ...initialState,

  setRecurrenceType: (type) =>
    set({ recurrenceType: type, recurrenceFrequency: type === "recorrencia" ? "mensal" : null }),

  setRecurrenceFrequency: (frequency) => set({ recurrenceFrequency: frequency }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setSelectedTime: (time) => set({ selectedTime: time }),

  loadTimeSlots: async (date) => {
    set({ isLoadingTimeSlots: true, error: null });

    const result = await loadTimeSlots(date);
    set({
      timeSlots: result.data ?? [],
      isLoadingTimeSlots: false,
      error: result.error,
    });
  },

  reset: () => set(initialState),
}));

export { useSchedulingStore, type SchedulingStore };
