import { create } from "zustand";

interface PasswordVisibilityState {
  visibleFields: Record<string, boolean>;
  isVisible: (fieldId: string) => boolean;
  toggleVisibility: (fieldId: string) => void;
  setVisibility: (fieldId: string, visible: boolean) => void;
  resetAll: () => void;
}

const usePasswordVisibilityStore = create<PasswordVisibilityState>()((set, get) => ({
  visibleFields: {},

  isVisible: (fieldId) => get().visibleFields[fieldId] ?? false,

  toggleVisibility: (fieldId) =>
    set((state) => ({
      visibleFields: {
        ...state.visibleFields,
        [fieldId]: !state.visibleFields[fieldId],
      },
    })),

  setVisibility: (fieldId, visible) =>
    set((state) => ({
      visibleFields: { ...state.visibleFields, [fieldId]: visible },
    })),

  resetAll: () => set({ visibleFields: {} }),
}));

export { usePasswordVisibilityStore, type PasswordVisibilityState };
