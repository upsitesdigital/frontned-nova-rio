import { create } from "zustand";

import type {
  ClientDashboardSummary,
  ServiceDetailModalEntry,
  ServiceHistoryEntry,
} from "@/api/dashboard-api";
import { loadClientDashboard } from "@/use-cases/load-client-dashboard";

interface DashboardState {
  summary: ClientDashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  isAuthError: boolean;
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
  isAuthError: false,
  selectedDetailEntry: null,
  editEntry: null,
  serviceHistoryFilter: "recent",
  sidePanelRecurrenceType: "monthly",
};

const useDashboardStore = create<DashboardStore>()((set) => ({
  ...initialState,

  loadSummary: async () => {
    set({ isLoading: true, error: null });

    const result = await loadClientDashboard();
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

  setSidePanelRecurrenceType: (type) => set({ sidePanelRecurrenceType: type }),

  reset: () => set(initialState),
}));

export { useDashboardStore, type DashboardStore };
