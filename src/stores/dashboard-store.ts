import { create } from "zustand";

import {
  fetchClientDashboardSummary,
  type ClientDashboardSummary,
} from "@/api/dashboard-api";
import { HttpClientError } from "@/api/http-client";
import { useAuthStore } from "@/stores/auth-store";

interface DashboardState {
  summary: ClientDashboardSummary | null;
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  loadSummary: () => Promise<void>;
  reset: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  summary: null,
  isLoading: false,
  error: null,
};

const useDashboardStore = create<DashboardStore>()((set) => ({
  ...initialState,

  loadSummary: async () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const summary = await fetchClientDashboardSummary(token);
      set({ summary, isLoading: false });
    } catch (error) {
      const message =
        error instanceof HttpClientError
          ? error.message
          : "Erro ao carregar o painel. Tente novamente.";
      set({ isLoading: false, error: message });
    }
  },

  reset: () => set(initialState),
}));

export { useDashboardStore, type DashboardStore };
