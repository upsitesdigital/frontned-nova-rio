import { fetchClients } from "@/api/admin-appointments-api";
import { MESSAGES } from "@/lib/messages";

interface ClientOption {
  id: number;
  name: string;
}

interface GetApprovedClientOptionsResult {
  data: ClientOption[] | null;
  error: string | null;
}

async function getApprovedClientOptions(): Promise<GetApprovedClientOptionsResult> {
  try {
    const clients = await fetchClients();
    const approvedOptions = clients
      .filter((c) => c.status === "APPROVED")
      .map((c) => ({ id: c.id, name: c.name }));
    return { data: approvedOptions, error: null };
  } catch {
    return { data: null, error: MESSAGES.adminAppointments.clientsError };
  }
}

export { getApprovedClientOptions, type ClientOption };
