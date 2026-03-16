import { create } from "zustand";

type ServiceHistoryFilter = "all" | "recurrence" | "one_time";

interface ServicesHistoryState {
  filter: ServiceHistoryFilter;
  currentPage: number;
}

interface ServicesHistoryActions {
  setFilter: (filter: ServiceHistoryFilter) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
}

type ServicesHistoryStore = ServicesHistoryState & ServicesHistoryActions;

const initialState: ServicesHistoryState = {
  filter: "all",
  currentPage: 1,
};

const useServicesHistoryStore = create<ServicesHistoryStore>()((set) => ({
  ...initialState,

  setFilter: (filter) => set({ filter, currentPage: 1 }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  reset: () => set(initialState),
}));

export {
  useServicesHistoryStore,
  type ServicesHistoryStore,
  type ServiceHistoryFilter,
};
