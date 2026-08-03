import { HttpClient } from "@/api/core/http-client";

type AdminPaymentStatus = "APPROVED" | "PENDING" | "CANCELLED";
type AdminPaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX";

interface AdminPayment {
  id: number;
  uuid: string;
  amount: string;
  subtotal: string;
  serviceFee: string;
  discount: string;
  method: AdminPaymentMethod;
  status: AdminPaymentStatus;
  cancellationReason: string | null;
  gatewayTransactionId: string | null;
  pixCode: string | null;
  pixQrCodeUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  client: { id: number; name: string; email: string; cpfCnpj: string | null };
  appointment: {
    id: number;
    date: string;
    startTime: string;
    service: { id: number; name: string };
    recurrenceType: "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  };
  card: { id: number; lastFourDigits: string; brand: string } | null;
}

interface AdminPaymentsResponse {
  data: AdminPayment[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminPaymentsParams {
  page: number;
  limit: number;
  status?: AdminPaymentStatus;
  method?: AdminPaymentMethod;
  clientId?: number;
  dateFrom?: string;
  dateTo?: string;
}

class AdminPaymentsApi {
  static async fetchAdminPayments(
    params: ListAdminPaymentsParams,
    signal?: AbortSignal,
  ): Promise<AdminPaymentsResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });

    if (params.status) searchParams.set("status", params.status);
    if (params.method) searchParams.set("method", params.method);
    if (params.clientId) searchParams.set("clientId", String(params.clientId));
    if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.set("dateTo", params.dateTo);

    return HttpClient.authGet<AdminPaymentsResponse>(
      `/admin/payments?${searchParams.toString()}`,
      signal,
    );
  }

  static async fetchAdminPaymentById(id: number): Promise<AdminPayment> {
    return HttpClient.authGet<AdminPayment>(`/admin/payments/${id}`);
  }

  static async cancelAdminPayment(id: number): Promise<void> {
    await HttpClient.authPatch(`/admin/payments/${id}/cancel`);
  }
}

export {
  AdminPaymentsApi,
  type AdminPayment,
  type AdminPaymentStatus,
  type AdminPaymentMethod,
  type AdminPaymentsResponse,
  type ListAdminPaymentsParams,
};
