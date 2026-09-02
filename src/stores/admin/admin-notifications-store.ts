import { create } from "zustand";
import {
  AdminNotificationsApi,
  type AdminNotificationEvent,
  type AdminNotificationSetting,
} from "@/api/admin/admin-notifications-api";

interface AdminNotificationsState {
  settings: AdminNotificationSetting[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  newEmail: string;
  newEvents: AdminNotificationEvent[];
  isAddingNew: boolean;

  load: () => Promise<void>;
  setNewEmail: (email: string) => void;
  setNewEvents: (events: AdminNotificationEvent[]) => void;
  toggleNewEvent: (event: AdminNotificationEvent) => void;
  openAdd: () => void;
  cancelAdd: () => void;
  addSetting: () => Promise<boolean>;
  toggleEvent: (id: number, event: AdminNotificationEvent) => Promise<void>;
  removeSetting: (id: number) => Promise<void>;
  reset: () => void;
}

const initialState = {
  settings: [],
  isLoading: false,
  isSaving: false,
  error: null,
  newEmail: "",
  newEvents: [] as AdminNotificationEvent[],
  isAddingNew: false,
};

export const useAdminNotificationsStore = create<AdminNotificationsState>((set, get) => ({
  ...initialState,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await AdminNotificationsApi.list();
      set({ settings, isLoading: false });
    } catch {
      set({ error: "Erro ao carregar configurações de notificação.", isLoading: false });
    }
  },

  setNewEmail: (email) => set({ newEmail: email }),

  setNewEvents: (events) => set({ newEvents: events }),

  toggleNewEvent: (event) => {
    const { newEvents } = get();
    set({
      newEvents: newEvents.includes(event)
        ? newEvents.filter((e) => e !== event)
        : [...newEvents, event],
    });
  },

  openAdd: () => set({ isAddingNew: true, newEmail: "", newEvents: [], error: null }),

  cancelAdd: () => set({ isAddingNew: false, newEmail: "", newEvents: [] }),

  addSetting: async () => {
    const { newEmail, newEvents } = get();
    if (!newEmail || newEvents.length === 0) {
      set({ error: "Informe um e-mail e selecione pelo menos um evento." });
      return false;
    }
    set({ isSaving: true, error: null });
    try {
      const created = await AdminNotificationsApi.create(newEmail, newEvents);
      set((s) => ({
        settings: [...s.settings, created],
        isAddingNew: false,
        newEmail: "",
        newEvents: [],
        isSaving: false,
      }));
      return true;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erro ao adicionar destinatário.";
      set({ error: message, isSaving: false });
      return false;
    }
  },

  toggleEvent: async (id, event) => {
    const { settings } = get();
    const setting = settings.find((s) => s.id === id);
    if (!setting) return;

    const newEvents = setting.events.includes(event)
      ? setting.events.filter((e) => e !== event)
      : [...setting.events, event];

    // Optimistic update
    set((s) => ({
      settings: s.settings.map((item) =>
        item.id === id ? { ...item, events: newEvents } : item,
      ),
    }));

    try {
      await AdminNotificationsApi.update(id, newEvents);
    } catch {
      // Revert on error
      set((s) => ({
        settings: s.settings.map((item) =>
          item.id === id ? { ...item, events: setting.events } : item,
        ),
        error: "Erro ao atualizar eventos.",
      }));
    }
  },

  removeSetting: async (id) => {
    set((s) => ({ settings: s.settings.filter((item) => item.id !== id) }));
    try {
      await AdminNotificationsApi.remove(id);
    } catch {
      const { settings } = get();
      const removed = get().settings.find((s) => s.id === id);
      if (!removed) {
        const backup = await AdminNotificationsApi.list().catch(() => settings);
        set({ settings: backup, error: "Erro ao remover destinatário." });
      }
    }
  },

  reset: () => set(initialState),
}));
