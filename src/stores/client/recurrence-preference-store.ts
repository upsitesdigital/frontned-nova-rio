import { create } from "zustand";

import type { RecurrenceFrequencyCode } from "@/api/client/profile-api";
import { RecurrencePreference } from "@/use-cases/client/recurrence-preference";

interface RecurrencePreferenceState {
  preferredRecurrence: RecurrenceFrequencyCode | null;
  isSaving: boolean;
}

interface RecurrencePreferenceActions {
  loadPreference: () => Promise<void>;
  savePreference: (code: RecurrenceFrequencyCode) => Promise<void>;
  reset: () => void;
}

type RecurrencePreferenceStore = RecurrencePreferenceState & RecurrencePreferenceActions;

const initialState: RecurrencePreferenceState = {
  preferredRecurrence: null,
  isSaving: false,
};

export const useRecurrencePreferenceStore = create<RecurrencePreferenceStore>()((set) => ({
  ...initialState,

  loadPreference: async () => {
    const code = await RecurrencePreference.load();
    set({ preferredRecurrence: code });
  },

  savePreference: async (code) => {
    set({ preferredRecurrence: code, isSaving: true });
    const success = await RecurrencePreference.save(code);
    set({ isSaving: false, ...(success ? {} : { preferredRecurrence: null }) });
  },

  reset: () => set(initialState),
}));

export type { RecurrencePreferenceStore };
