import { HttpClient } from "@/api/core/http-client";

export type PaymentStatus = "APPROVED" | "PENDING" | "CANCELLED";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX";

export interface PaymentEntry {
  id: number;
  uuid: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  pixCode: string | null;
  pixQrCodeUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  appointment: {
    id: number;
    date: string;
    startTime: string;
    service: { id: number; name: string };
  };
  card: { id: number; lastFourDigits: string; brand: string } | null;
}

export interface CreatePublicCheckoutPayload {
  email: string;
  date: string;
  startTime: string;
  duration: number;
  serviceId: number;
  recurrenceType?: string;
  weeklyFrequency?: number;
  packageId?: number;
  unitId?: number;
  notes?: string;
  locationZip?: string;
  locationAddress?: string;
  method: string;
  cardNumber?: string;
  cardCvv?: string;
  cardExpiry?: string;
  holderName?: string;
  billingName?: string;
  billingDocument?: string;
  billingAddress?: string;
  billingComplement?: string;
}

export interface PaginatedPayments {
  data: PaymentEntry[];
  total: number;
  page: number;
  limit: number;
}

export class PaymentsApi {
  static fetchClientPayments(
    page: number,
    limit: number,
    status?: PaymentStatus,
    signal?: AbortSignal,
  ): Promise<PaginatedPayments> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (status) {
      params.set("status", status);
    }

    return HttpClient.authGet<PaginatedPayments>(`/payments?${params.toString()}`, signal);
  }
  static async createPayment(
    appointmentId: number,
    method: string,
    cardId?: number,
  ): Promise<PaymentEntry> {
    return HttpClient.authPost<PaymentEntry>("/payments", {
      appointmentId,
      method,
      ...(cardId ? { cardId } : {}),
    });
  }

  static async createPublicCheckout(data: CreatePublicCheckoutPayload): Promise<PaymentEntry> {
    return HttpClient.post<PaymentEntry>("/payments/public/checkout", data);
  }
}
