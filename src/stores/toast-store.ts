import { create } from "zustand";

import type { DsAlertVariant } from "@/design-system/feedback/ds-alert";

interface Toast {
  id: number;
  title: string;
  variant: DsAlertVariant;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  showToast: (title: string, variant?: DsAlertVariant) => void;
  removeToast: (id: number) => void;
  reset: () => void;
}

type ToastStore = ToastState & ToastActions;

let nextId = 0;

const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],

  showToast: (title, variant = "success") => {
    const id = ++nextId;
    set((state) => ({ toasts: [...state.toasts, { id, title, variant }] }));
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  reset: () => {
    nextId = 0;
    set({ toasts: [] });
  },
}));

export { useToastStore, type ToastStore, type Toast };
