import { create } from "zustand";

import type { AgendaItem } from "@/api/admin-dashboard-api";
import { loadTodayAgenda } from "@/use-cases/load-admin-agenda";
import type { ActiveServiceOption } from "@/use-cases/get-active-service-options";

interface AdminAgendaState {
  agendaItems: AgendaItem[];
  agendaTotal: number;
  agendaPage: number;
  agendaServiceFilter: string;
  serviceOptions: ActiveServiceOption[];
  isAgendaLoading: boolean;
  isAuthError: boolean;
}

interface AdminAgendaActions {
  hydrateFromDashboard: (
    items: AgendaItem[],
    total: number,
    serviceOptions: ActiveServiceOption[],
  ) => void;
  loadAgenda: (page: number, serviceId?: number) => Promise<void>;
  setAgendaPage: (page: number) => void;
  setAgendaServiceFilter: (value: string) => void;
  reset: () => void;
}

type AdminAgendaStore = AdminAgendaState & AdminAgendaActions;

const AGENDA_PAGE_SIZE = 6;

const initialState: AdminAgendaState = {
  agendaItems: [],
  agendaTotal: 0,
  agendaPage: 1,
  agendaServiceFilter: "all",
  serviceOptions: [],
  isAgendaLoading: false,
  isAuthError: false,
};

function parseServiceId(filter: string): number | undefined {
  if (filter === "all") return undefined;
  const id = Number(filter);
  return Number.isNaN(id) ? undefined : id;
}

let agendaAbortController: AbortController | null = null;

const useAdminAgendaStore = create<AdminAgendaStore>()((set, get) => ({
  ...initialState,

  hydrateFromDashboard: (items, total, serviceOptions) => {
    set({ agendaItems: items, agendaTotal: total, serviceOptions, agendaPage: 1 });
  },

  loadAgenda: async (page: number, serviceId?: number) => {
    agendaAbortController?.abort();
    agendaAbortController = new AbortController();
    const { signal } = agendaAbortController;

    set({ isAgendaLoading: true });

    const result = await loadTodayAgenda(page, AGENDA_PAGE_SIZE, serviceId, signal);

    if (result.items) {
      set({
        agendaItems: result.items,
        agendaTotal: result.total,
        agendaPage: page,
        isAgendaLoading: false,
      });
    } else if (result.isAuthError) {
      set({ isAgendaLoading: false, isAuthError: true });
    } else {
      set({ isAgendaLoading: false });
    }
  },

  setAgendaPage: (page: number) => {
    const serviceId = parseServiceId(get().agendaServiceFilter);
    get().loadAgenda(page, serviceId);
  },

  setAgendaServiceFilter: (value: string) => {
    set({ agendaServiceFilter: value, agendaPage: 1, isAgendaLoading: true, agendaItems: [] });
    const serviceId = parseServiceId(value);
    get().loadAgenda(1, serviceId);
  },

  reset: () => set(initialState),
}));

export { useAdminAgendaStore, AGENDA_PAGE_SIZE, type AdminAgendaStore };
