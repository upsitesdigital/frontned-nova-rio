import { create } from "zustand";

import type {
  ClientDashboardSummary,
  ServiceDetailModalEntry,
  ServiceHistoryEntry,
} from "@/api/client/dashboard-api";
import { LoadClientDashboard } from "@/use-cases/client-dashboard/load-client-dashboard";

interface DashboardState {
  summary: ClientDashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  isAuthError: boolean;
  selectedDetailEntry: ServiceDetailModalEntry | null;
  editEntry: ServiceHistoryEntry | null;
  serviceHistoryFilter: string;
}

interface DashboardActions {
  loadSummary: () => Promise<void>;
  setSelectedDetailEntry: (entry: ServiceDetailModalEntry | null) => void;
  setEditEntry: (entry: ServiceHistoryEntry | null) => void;
  setServiceHistoryFilter: (filter: string) => void;
  reset: () => void;
}

type DashboardStore = DashboardState & DashboardActions;
let dashboardLoadSeq = 0;

const initialState: DashboardState = {
  summary: null,
  isLoading: false,
  error: null,
  isAuthError: false,
  selectedDetailEntry: null,
  editEntry: null,
  serviceHistoryFilter: "recent",
};

const useDashboardStore = create<DashboardStore>()((set) => ({
  ...initialState,

  loadSummary: async () => {
    const seq = ++dashboardLoadSeq;
    set({ isLoading: true, error: null });

    const result = await LoadClientDashboard.loadClientDashboard();
    if (seq !== dashboardLoadSeq) return;
    set({
      summary: result.data,
      isLoading: false,
      error: result.error,
      isAuthError: result.isAuthError,
    });
  },

  setSelectedDetailEntry: (entry) => set({ selectedDetailEntry: entry }),

  setEditEntry: (entry) => set({ editEntry: entry }),

  setServiceHistoryFilter: (filter) => set({ serviceHistoryFilter: filter }),

  reset: () => {
    dashboardLoadSeq++;
    set(initialState);
  },
}));

export { useDashboardStore, type DashboardStore };
