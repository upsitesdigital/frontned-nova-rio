import { describe, it, expect } from "vitest";
import { PAYMENT_STATUS_MAP, resolvePaymentStatus } from "./payment-status-map";

describe("payment-status-map", () => {
  describe("PAYMENT_STATUS_MAP", () => {
    it("should have exactly 3 entries", () => {
      expect(Object.keys(PAYMENT_STATUS_MAP)).toHaveLength(3);
    });

    it("should map APPROVED to approved status with label 'Aprovado'", () => {
      expect(PAYMENT_STATUS_MAP["APPROVED"]).toEqual({
        status: "approved",
        label: "Aprovado",
      });
    });

    it("should map PENDING to pending status with label 'Pendente'", () => {
      expect(PAYMENT_STATUS_MAP["PENDING"]).toEqual({
        status: "pending",
        label: "Pendente",
      });
    });

    it("should map CANCELLED to cancelled status with label 'Cancelado'", () => {
      expect(PAYMENT_STATUS_MAP["CANCELLED"]).toEqual({
        status: "cancelled",
        label: "Cancelado",
      });
    });

    it("should have correct status field types", () => {
      const validStatuses = ["approved", "pending", "cancelled"];
      Object.values(PAYMENT_STATUS_MAP).forEach((info) => {
        expect(validStatuses).toContain(info.status);
        expect(typeof info.label).toBe("string");
      });
    });
  });

  describe("resolvePaymentStatus", () => {
    it("should resolve APPROVED status", () => {
      const result = resolvePaymentStatus("APPROVED");
      expect(result).toEqual({ status: "approved", label: "Aprovado" });
    });

    it("should resolve PENDING status", () => {
      const result = resolvePaymentStatus("PENDING");
      expect(result).toEqual({ status: "pending", label: "Pendente" });
    });

    it("should resolve CANCELLED status", () => {
      const result = resolvePaymentStatus("CANCELLED");
      expect(result).toEqual({ status: "cancelled", label: "Cancelado" });
    });

    it("should return pending fallback with raw label for unknown status", () => {
      const result = resolvePaymentStatus("REFUNDED");
      expect(result).toEqual({ status: "pending", label: "REFUNDED" });
    });

    it("should return pending fallback for empty string", () => {
      const result = resolvePaymentStatus("");
      expect(result).toEqual({ status: "pending", label: "" });
    });

    it("should be case-sensitive", () => {
      const result = resolvePaymentStatus("approved");
      expect(result).toEqual({ status: "pending", label: "approved" });
    });
  });
});
