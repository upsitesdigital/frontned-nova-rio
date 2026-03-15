import { httpAuthGet } from "./http-client";

interface ServiceHistoryEntryPayment {
  paymentId: number;
  cardLastFour: string | null;
  amount: string;
  status: string;
}

interface ServiceHistoryEntry {
  id: number;
  date: string;
  startTime: string;
  label: string;
  icon: string | null;
  status: string;
  canEdit: boolean;
  recurrenceType: string;
  locationName: string | null;
  locationZip: string | null;
  locationAddress: string | null;
  payment: ServiceHistoryEntryPayment | null;
}

interface ServiceHistoryMonth {
  monthLabel: string;
  entries: ServiceHistoryEntry[];
}

interface ServiceDetailModalEntry {
  label: string;
  icon: string | null;
  date: string;
  recurrenceType: string;
  locationName: string | null;
  payment: {
    cardLastFour: string | null;
    amount: string;
    status: string;
  } | null;
}

interface ClientDashboardSummary {
  clientName: string;
  nextAppointment: {
    id: number;
    date: string;
    dateTime: string;
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
  type ServiceDetailModalEntry,
  type ServiceHistoryMonth,
  type ServiceHistoryEntry,
  type ServiceHistoryEntryPayment,
};
