import { create } from "zustand";

import {
  fetchAdminProfile,
  fetchTodayAppointmentsCount,
  fetchActiveClientsCount,
  fetchPendingAppointmentsCount,
  fetchTodayAgenda,
  fetchServices,
  type AdminProfile,
  type AgendaItem,
  type ServiceOption,
} from "@/api/admin-dashboard-api";
import { HttpClientError } from "@/api/http-client";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface AdminDashboardState {
  profile: AdminProfile | null;
  todayAppointmentsCount: number;
  activeClientsCount: number;
  pendingServicesCount: number;
  agendaItems: AgendaItem[];
  agendaTotal: number;
  agendaPage: number;
  agendaServiceFilter: string;
  serviceOptions: ServiceOption[];
  isLoading: boolean;
  isAgendaLoading: boolean;
  error: string | null;
  isAuthError: boolean;
}

interface AdminDashboardActions {
  loadDashboard: () => Promise<void>;
  loadAgenda: (page: number, serviceId?: number) => Promise<void>;
  setAgendaPage: (page: number) => void;
  setAgendaServiceFilter: (value: string) => void;
  reset: () => void;
}

type AdminDashboardStore = AdminDashboardState & AdminDashboardActions;

const AGENDA_PAGE_SIZE = 6;

const initialState: AdminDashboardState = {
  profile: null,
  todayAppointmentsCount: 0,
  activeClientsCount: 0,
  pendingServicesCount: 0,
  agendaItems: [],
  agendaTotal: 0,
  agendaPage: 1,
  agendaServiceFilter: "all",
  serviceOptions: [],
  isLoading: false,
  isAgendaLoading: false,
  error: null,
  isAuthError: false,
};

function parseServiceId(filter: string): number | undefined {
  if (filter === "all") return undefined;
  const id = Number(filter);
  return Number.isNaN(id) ? undefined : id;
}

let agendaAbortController: AbortController | null = null;

const useAdminDashboardStore = create<AdminDashboardStore>()((set, get) => ({
  ...initialState,

  loadDashboard: async () => {
    if (get().profile && !get().error) return;

    set({ isLoading: true, error: null });

    try {
      const results = await Promise.allSettled([
        fetchAdminProfile(),
        fetchTodayAppointmentsCount(),
        fetchActiveClientsCount(),
        fetchPendingAppointmentsCount(),
        fetchTodayAgenda(1, AGENDA_PAGE_SIZE),
        fetchServices(),
      ]);

      const [profileR, todayR, clientsR, pendingR, agendaR, servicesR] = results;

      if (profileR.status === "rejected") {
        const error = profileR.reason;
        const isAuth =
          error instanceof HttpClientError && (error.status === 401 || error.status === 403);
        set({
          isLoading: false,
          error: resolveErrorMessage(error, MESSAGES.adminDashboard.loadError),
          isAuthError: isAuth,
        });
        return;
      }

      set({
        profile: profileR.value,
        todayAppointmentsCount: todayR.status === "fulfilled" ? todayR.value.count : 0,
        activeClientsCount: clientsR.status === "fulfilled" ? clientsR.value.count : 0,
        pendingServicesCount: pendingR.status === "fulfilled" ? pendingR.value.count : 0,
        agendaItems: agendaR.status === "fulfilled" ? agendaR.value.items : [],
        agendaTotal: agendaR.status === "fulfilled" ? agendaR.value.total : 0,
        agendaPage: 1,
        serviceOptions: servicesR.status === "fulfilled" ? servicesR.value : [],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: resolveErrorMessage(error, MESSAGES.adminDashboard.loadError),
      });
    }
  },

  loadAgenda: async (page: number, serviceId?: number) => {
    agendaAbortController?.abort();
    agendaAbortController = new AbortController();
    const { signal } = agendaAbortController;

    set({ isAgendaLoading: true });
    try {
      const agenda = await fetchTodayAgenda(page, AGENDA_PAGE_SIZE, serviceId, signal);
      set({
        agendaItems: agenda.items,
        agendaTotal: agenda.total,
        agendaPage: page,
        isAgendaLoading: false,
      });
    } catch (error) {
      if (signal.aborted) return;
      const isAuth =
        error instanceof HttpClientError && (error.status === 401 || error.status === 403);
      set({
        isAgendaLoading: false,
        ...(isAuth ? { isAuthError: true } : {}),
      });
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

export { useAdminDashboardStore, AGENDA_PAGE_SIZE, type AdminDashboardStore };
