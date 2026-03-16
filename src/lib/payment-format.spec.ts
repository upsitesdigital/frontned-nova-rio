import { describe, it, expect } from "vitest";
import type { PaymentEntry } from "@/api/payments-api";
import { sortPaymentsByStatus, formatPaymentMethod, formatPaymentAmount } from "./payment-format";

function makePayment(overrides: Partial<PaymentEntry> = {}): PaymentEntry {
  return {
    id: 1,
    uuid: "uuid-1",
    amount: "100.00",
    method: "CREDIT_CARD",
    status: "APPROVED",
    paidAt: null,
    createdAt: "2026-01-01",
    appointment: { id: 1, date: "2026-01-01", service: { id: 1, name: "Corte" } },
    card: { id: 1, lastFourDigits: "4242", brand: "visa" },
    ...overrides,
  };
}

describe("payment-format", () => {
  describe("sortPaymentsByStatus", () => {
    it("should sort APPROVED before PENDING before CANCELLED", () => {
      const payments = [
        makePayment({ id: 1, status: "CANCELLED" }),
        makePayment({ id: 2, status: "APPROVED" }),
        makePayment({ id: 3, status: "PENDING" }),
      ];

      const sorted = sortPaymentsByStatus(payments);

      expect(sorted[0].status).toBe("APPROVED");
      expect(sorted[1].status).toBe("PENDING");
      expect(sorted[2].status).toBe("CANCELLED");
    });

    it("should not mutate the original array", () => {
      const payments = [
        makePayment({ id: 1, status: "CANCELLED" }),
        makePayment({ id: 2, status: "APPROVED" }),
      ];

      const sorted = sortPaymentsByStatus(payments);

      expect(sorted).not.toBe(payments);
      expect(payments[0].status).toBe("CANCELLED");
    });

    it("should return empty array for empty input", () => {
      expect(sortPaymentsByStatus([])).toEqual([]);
    });

    it("should handle array with single element", () => {
      const payments = [makePayment({ status: "PENDING" })];
      const sorted = sortPaymentsByStatus(payments);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].status).toBe("PENDING");
    });
  });

  describe("formatPaymentMethod", () => {
    it("should return 'PIX' for PIX method", () => {
      const entry = makePayment({ method: "PIX", card: null });
      expect(formatPaymentMethod(entry)).toBe("PIX");
    });

    it("should return card info with last four digits when card exists", () => {
      const entry = makePayment({
        method: "CREDIT_CARD",
        card: { id: 1, lastFourDigits: "1234", brand: "visa" },
      });
      expect(formatPaymentMethod(entry)).toBe("Cartão •••• 1234");
    });

    it("should return 'Cartão' for card method without card info", () => {
      const entry = makePayment({ method: "CREDIT_CARD", card: null });
      expect(formatPaymentMethod(entry)).toBe("Cartão");
    });
  });

  describe("formatPaymentAmount", () => {
    it("should format integer amount", () => {
      expect(formatPaymentAmount("100")).toBe("R$ 100,00");
    });

    it("should format decimal amount", () => {
      expect(formatPaymentAmount("49.90")).toBe("R$ 49,90");
    });

    it("should format zero", () => {
      expect(formatPaymentAmount("0")).toBe("R$ 0,00");
    });

    it("should return R$ 0,00 for non-numeric string", () => {
      expect(formatPaymentAmount("abc")).toBe("R$ 0,00");
    });

    it("should return R$ 0,00 for empty string", () => {
      expect(formatPaymentAmount("")).toBe("R$ 0,00");
    });

    it("should format large amounts", () => {
      expect(formatPaymentAmount("12345.67")).toBe("R$ 12345,67");
    });

    it("should handle string with extra decimals", () => {
      expect(formatPaymentAmount("10.999")).toBe("R$ 11,00");
    });
  });
});
