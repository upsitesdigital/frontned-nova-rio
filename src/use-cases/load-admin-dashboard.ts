import {
  fetchTodayAppointmentsCount,
  fetchActiveClientsCount,
  fetchPendingAppointmentsCount,
  fetchTodayAgenda,
  type AgendaItem,
} from "@/api/admin-dashboard-api";
import { fetchAdminProfile, type AdminProfile } from "@/api/auth-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";
import { getActiveServiceOptions, type ActiveServiceOption } from "./get-active-service-options";

interface AdminDashboardData {
  profile: AdminProfile;
  todayAppointmentsCount: number;
  activeClientsCount: number;
  pendingServicesCount: number;
  agendaItems: AgendaItem[];
  agendaTotal: number;
  serviceOptions: ActiveServiceOption[];
}

interface DashboardLoadResult {
  data: AdminDashboardData | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminDashboardData(agendaPageSize: number): Promise<DashboardLoadResult> {
  const results = await Promise.allSettled([
    fetchAdminProfile(),
    fetchTodayAppointmentsCount(),
    fetchActiveClientsCount(),
    fetchPendingAppointmentsCount(),
    fetchTodayAgenda(1, agendaPageSize),
    getActiveServiceOptions(),
  ]);

  const [profileR, todayR, clientsR, pendingR, agendaR, servicesR] = results;

  if (profileR.status === "rejected") {
    return {
      data: null,
      error: resolveErrorMessage(profileR.reason, MESSAGES.adminDashboard.loadError),
      isAuthError: isAuthError(profileR.reason),
    };
  }

  return {
    data: {
      profile: profileR.value,
      todayAppointmentsCount: todayR.status === "fulfilled" ? todayR.value.count : 0,
      activeClientsCount: clientsR.status === "fulfilled" ? clientsR.value.count : 0,
      pendingServicesCount: pendingR.status === "fulfilled" ? pendingR.value.count : 0,
      agendaItems: agendaR.status === "fulfilled" ? agendaR.value.items : [],
      agendaTotal: agendaR.status === "fulfilled" ? agendaR.value.total : 0,
      serviceOptions: servicesR.status === "fulfilled" ? (servicesR.value.data ?? []) : [],
    },
    error: null,
    isAuthError: false,
  };
}

export { loadAdminDashboardData, type AdminDashboardData, type DashboardLoadResult };
