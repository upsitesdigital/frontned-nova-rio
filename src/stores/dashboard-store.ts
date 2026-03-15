import { create } from "zustand";

import {
  fetchClientDashboardSummary,
  type ClientDashboardSummary,
  type ServiceDetailModalEntry,
  type ServiceHistoryEntry,
} from "@/api/dashboard-api";
import { getAuthToken, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

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
    const token = await getAuthToken();
    if (!token) {
      set({ error: MESSAGES.auth.sessionExpired });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const summary = await fetchClientDashboardSummary(token);
      set({ summary, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: resolveErrorMessage(error, MESSAGES.dashboard.loadError),
      });
    }
  },

  setSelectedDetailEntry: (entry) => set({ selectedDetailEntry: entry }),

  setEditEntry: (entry) => set({ editEntry: entry }),

  setServiceHistoryFilter: (filter) => set({ serviceHistoryFilter: filter }),

  setSidePanelRecurrenceType: (type) => set({ sidePanelRecurrenceType: type }),

  reset: () => set(initialState),
}));

export { useDashboardStore, type DashboardStore };
