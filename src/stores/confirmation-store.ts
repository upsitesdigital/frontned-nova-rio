import { create } from "zustand";

import type { AppointmentConfirmation } from "@/types/appointment";

interface ConfirmationState {
  confirmation: AppointmentConfirmation | null;
}

interface ConfirmationActions {
  setConfirmation: (data: AppointmentConfirmation) => void;
  reset: () => void;
}

type ConfirmationStore = ConfirmationState & ConfirmationActions;

const initialState: ConfirmationState = {
  confirmation: null,
};

const useConfirmationStore = create<ConfirmationStore>()((set) => ({
  ...initialState,

  setConfirmation: (data) => set({ confirmation: data }),

  reset: () => set(initialState),
}));

export { useConfirmationStore, type ConfirmationStore };
