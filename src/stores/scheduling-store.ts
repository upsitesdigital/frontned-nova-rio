import { create } from "zustand";

import { getTimeSlots } from "@/api/scheduling-data";
import type { RecurrenceFrequency, RecurrenceType, TimeSlot } from "@/types/scheduling";

interface SchedulingState {
  recurrenceType: RecurrenceType | null;
  recurrenceFrequency: RecurrenceFrequency | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  timeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
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
};

const useSchedulingStore = create<SchedulingStore>()((set) => ({
  ...initialState,

  setRecurrenceType: (type) =>
    set({ recurrenceType: type, recurrenceFrequency: type === "recorrencia" ? "mensal" : null }),

  setRecurrenceFrequency: (frequency) => set({ recurrenceFrequency: frequency }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setSelectedTime: (time) => set({ selectedTime: time }),

  loadTimeSlots: async (date) => {
    set({ isLoadingTimeSlots: true });
    try {
      const timeSlots = await getTimeSlots(date);
      set({ timeSlots, isLoadingTimeSlots: false });
    } catch (error) {
      console.error("Failed to load time slots:", error);
      set({ timeSlots: [], isLoadingTimeSlots: false });
    }
  },

  reset: () => set(initialState),
}));

export { useSchedulingStore, type SchedulingStore };
