import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { Messages } from "@/lib/core/messages";

interface ClientOption {
  id: number;
  name: string;
}

interface GetApprovedClientOptionsResult {
  data: ClientOption[] | null;
  error: string | null;
}

class GetApprovedClientOptions {
  static async getApprovedClientOptions(): Promise<GetApprovedClientOptionsResult> {
    try {
      const clients = await AdminAppointmentsApi.fetchClients();
      const approvedOptions = clients
        .filter((c) => c.status === "APPROVED")
        .map((c) => ({ id: c.id, name: c.name }));
      return { data: approvedOptions, error: null };
    } catch {
      return { data: null, error: Messages.adminAppointments.clientsError };
    }
  }
}

export { GetApprovedClientOptions, type ClientOption };
