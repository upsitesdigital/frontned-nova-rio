import { create } from "zustand";

import { fetchClientDashboardSummary, type ClientDashboardSummary } from "@/api/dashboard-api";
import { HttpClientError } from "@/api/http-client";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";
import type { ServiceDetailModalEntry } from "@/app/dashboard/servicos/_components/service-detail-modal";
import type { ServiceHistoryEntry } from "@/app/dashboard/_components/dashboard-service-history";

interface DashboardState {
  summary: ClientDashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  selectedDetailEntry: ServiceDetailModalEntry | null;
  editEntry: ServiceHistoryEntry | null;
  serviceHistoryFilter: string;
  sidePanelRecurrenceType: string;
}

interface DashboardActions {
  loadSummary: () => Promise<void>;
  setSelectedDetailEntry: (entry: ServiceDetailModalEntry | null) => void;
  setEditEntry: (entry: ServiceHistoryEntry | null) => void;
  setServiceHistoryFilter: (filter: string) => void;
  setSidePanelRecurrenceType: (type: string) => void;
  reset: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  summary: null,
  isLoading: false,
  error: null,
  selectedDetailEntry: null,
  editEntry: null,
  serviceHistoryFilter: "recent",
  sidePanelRecurrenceType: "monthly",
};

const useDashboardStore = create<DashboardStore>()((set) => ({
  ...initialState,

  loadSummary: async () => {
    await waitForAuthHydration();

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

  setSelectedDetailEntry: (entry) => set({ selectedDetailEntry: entry }),

  setEditEntry: (entry) => set({ editEntry: entry }),

  setServiceHistoryFilter: (filter) => set({ serviceHistoryFilter: filter }),

  setSidePanelRecurrenceType: (type) => set({ sidePanelRecurrenceType: type }),

  reset: () => set(initialState),
}));

export { useDashboardStore, type DashboardStore };
