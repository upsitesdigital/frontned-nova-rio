import { describe, it, expect } from "vitest";
import { PaymentStatus } from "./payment-status-map";

describe("payment-status-map", () => {
  describe("PaymentStatus.paymentStatusMap", () => {
    it("should have exactly 3 entries", () => {
      expect(Object.keys(PaymentStatus.paymentStatusMap)).toHaveLength(3);
    });

    it("should map APPROVED to approved status with label 'Aprovado'", () => {
      expect(PaymentStatus.paymentStatusMap["APPROVED"]).toEqual({
        status: "approved",
        label: "Aprovado",
      });
    });

    it("should map PENDING to pending status with label 'Pendente'", () => {
      expect(PaymentStatus.paymentStatusMap["PENDING"]).toEqual({
        status: "pending",
        label: "Pendente",
      });
    });

    it("should map CANCELLED to cancelled status with label 'Cancelado'", () => {
      expect(PaymentStatus.paymentStatusMap["CANCELLED"]).toEqual({
        status: "cancelled",
        label: "Cancelado",
      });
    });

    it("should have correct status field types", () => {
      const validStatuses = ["approved", "pending", "cancelled"];
      Object.values(PaymentStatus.paymentStatusMap).forEach((info) => {
        expect(validStatuses).toContain(info.status);
        expect(typeof info.label).toBe("string");
      });
    });
  });

  describe("PaymentStatus.resolvePaymentStatus", () => {
    it("should resolve APPROVED status", () => {
      const result = PaymentStatus.resolvePaymentStatus("APPROVED");
      expect(result).toEqual({ status: "approved", label: "Aprovado" });
    });

    it("should resolve PENDING status", () => {
      const result = PaymentStatus.resolvePaymentStatus("PENDING");
      expect(result).toEqual({ status: "pending", label: "Pendente" });
    });

    it("should resolve CANCELLED status", () => {
      const result = PaymentStatus.resolvePaymentStatus("CANCELLED");
      expect(result).toEqual({ status: "cancelled", label: "Cancelado" });
    });

    it("should return pending fallback with raw label for unknown status", () => {
      const result = PaymentStatus.resolvePaymentStatus("REFUNDED");
      expect(result).toEqual({ status: "pending", label: "REFUNDED" });
    });

    it("should return pending fallback for empty string", () => {
      const result = PaymentStatus.resolvePaymentStatus("");
      expect(result).toEqual({ status: "pending", label: "" });
    });

    it("should be case-sensitive", () => {
      const result = PaymentStatus.resolvePaymentStatus("approved");
      expect(result).toEqual({ status: "pending", label: "approved" });
    });
  });
});
