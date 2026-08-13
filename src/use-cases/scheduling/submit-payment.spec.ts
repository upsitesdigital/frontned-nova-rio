import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/client/payments-api", () => ({
  PaymentsApi: { createPublicCheckout: vi.fn() },
}));

vi.mock("@/api/core/http-client", () => ({
  HttpClientError: class HttpClientError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpClientError";
    }
  },
}));

const paymentsApi = await import("@/api/client/payments-api");
const { HttpClientError } = await import("@/lib/auth/http-error");
const { SubmitPayment } = await import("./submit-payment");

const baseParams = {
  email: "user@test.com",
  selectedServiceId: 1,
  serviceDurationMinutes: 120,
  selectedDate: new Date(2026, 2, 15),
  selectedTime: "10:00",
  recurrenceType: null,
  recurrenceFrequency: null,
  weeklyFrequency: 1,
  cep: "",
  address: null,
  paymentMethod: "pix",
  cardData: null,
  billingName: "",
  billingDocument: "",
  billingAddress: "",
  billingComplement: "",
};

const fakePayment = {
  id: 1,
  uuid: "pay-uuid",
  amount: "50.00",
  method: "PIX" as const,
  status: "PENDING" as const,
  pixCode: "pix-code-123",
  pixQrCodeUrl: null,
  paidAt: null,
  createdAt: "2026-03-15T10:00:00Z",
  appointment: {
    id: 1,
    date: "2026-03-15",
    startTime: "10:00",
    service: { id: 1, name: "Limpeza" },
  },
  card: null,
};

describe("submitPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return success with confirmation and payment on valid submission", async () => {
      vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mockResolvedValue(fakePayment);

      const result = await SubmitPayment.submitPayment(baseParams);

      expect(result).toEqual({
        success: true,
        confirmation: {
          serviceName: "Limpeza",
          date: "2026-03-15",
          startTime: "10:00",
        },
        payment: {
          pixCode: "pix-code-123",
          pixQrCodeUrl: undefined,
        },
      });
    });

    it("should format date as yyyy-MM-dd and send a single merged checkout payload", async () => {
      vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mockResolvedValue(fakePayment);

      await SubmitPayment.submitPayment(baseParams);

      expect(paymentsApi.PaymentsApi.createPublicCheckout).toHaveBeenCalledTimes(1);
      const payload = vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mock.calls[0][0];
      expect(payload.date).toBe("2026-03-15");
      expect(payload.startTime).toBe("10:00");
      expect(payload.serviceId).toBe(1);
      expect(payload.method).toBe("PIX");
    });

    it("should map recurrenceType 'avulso' to 'SINGLE'", async () => {
      vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mockResolvedValue(fakePayment);

      await SubmitPayment.submitPayment({ ...baseParams, recurrenceType: "avulso" });

      const payload = vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mock.calls[0][0];
      expect(payload.recurrenceType).toBe("SINGLE");
    });
  });

  describe("error handling", () => {
    it("should surface backend message on checkout failure", async () => {
      vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mockRejectedValue(
        new HttpClientError(400, "Request failed"),
      );

      const result = await SubmitPayment.submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Request failed" });
    });

    it("should return fallback error message for non-Error throws", async () => {
      vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mockRejectedValue("unknown");

      const result = await SubmitPayment.submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Erro ao criar agendamento." });
    });

    it("should return fallback for a generic (non-HTTP) error instead of leaking its message", async () => {
      vi.mocked(paymentsApi.PaymentsApi.createPublicCheckout).mockRejectedValue(
        new Error("Failed to fetch"),
      );

      const result = await SubmitPayment.submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Erro ao criar agendamento." });
    });
  });
});
