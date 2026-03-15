import { httpAuthGet } from "./http-client";

type PaymentStatus = "APPROVED" | "PENDING" | "CANCELLED";
type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX";

interface PaymentEntry {
  id: number;
  uuid: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  appointment: {
    id: number;
    date: string;
    service: { id: number; name: string };
  };
  card: { id: number; lastFourDigits: string; brand: string } | null;
}

interface PaginatedPayments {
  data: PaymentEntry[];
  total: number;
  page: number;
  limit: number;
}

async function fetchClientPayments(
  token: string,
  page: number,
  limit: number,
  status?: PaymentStatus,
): Promise<PaginatedPayments> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    params.set("status", status);
  }

  return httpAuthGet<PaginatedPayments>(`/payments?${params.toString()}`, token);
}

export {
  fetchClientPayments,
  type PaginatedPayments,
  type PaymentEntry,
  type PaymentStatus,
  type PaymentMethod,
};
