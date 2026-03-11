import { httpAuthGet } from "./http-client";

interface ServiceHistoryEntryPayment {
  cardLastFour: string | null;
  amount: string;
  status: string;
}

interface ServiceHistoryEntry {
  id: number;
  date: string;
  label: string;
  icon: string | null;
  status: string;
  canEdit: boolean;
  recurrenceType: string;
  locationName: string | null;
  payment: ServiceHistoryEntryPayment | null;
}

interface ServiceHistoryMonth {
  monthLabel: string;
  entries: ServiceHistoryEntry[];
}

interface ClientDashboardSummary {
  clientName: string;
  nextAppointment: {
    date: string;
    cancellationNote: string;
  } | null;
  appointmentsCount: number;
  appointmentsCountLabel: string;
  serviceHistory: ServiceHistoryMonth[];
}

async function fetchClientDashboardSummary(token: string): Promise<ClientDashboardSummary> {
  return httpAuthGet<ClientDashboardSummary>("/client/dashboard/summary", token);
}

export {
  fetchClientDashboardSummary,
  type ClientDashboardSummary,
  type ServiceHistoryMonth,
  type ServiceHistoryEntry,
  type ServiceHistoryEntryPayment,
};
