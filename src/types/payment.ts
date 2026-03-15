import type { DsRecentPaymentStatus } from "@/design-system";

interface RegisteredCard {
  id: number;
  brandSrc: string;
  lastDigits: string;
  expiry: string;
}

interface RecentPayment {
  id: number;
  method: "card" | "pix";
  methodLabel: string;
  service: string;
  amount: string;
  status: DsRecentPaymentStatus;
  statusLabel: string;
}

export type { RegisteredCard, RecentPayment };
