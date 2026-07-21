import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/client/appointments-api", () => ({
  AppointmentsApi: { createPublicAppointment: vi.fn() },
}));

vi.mock("@/api/client/payments-api", () => ({
  PaymentsApi: { createPublicPayment: vi.fn() },
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

const api = await import("@/api/client/appointments-api");
const paymentsApi = await import("@/api/client/payments-api");
const { SubmitPayment } = await import("./submit-payment");

const baseParams = {
  email: "user@test.com",
  selectedServiceId: 1,
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

const fakeAppointment = {
  id: 1,
  uuid: "uuid-123",
  date: "2026-03-15",
  startTime: "10:00",
  duration: 120,
  status: "SCHEDULED",
  service: { id: 1, name: "Limpeza" },
  client: { id: 2, name: "John", email: "user@test.com" },
  paymentToken: "payment-token-123",
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
  appointment: { id: 1, date: "2026-03-15", service: { id: 1, name: "Limpeza" } },
  card: null,
};

describe("submitPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return success with confirmation and payment on valid submission", async () => {
      vi.mocked(api.AppointmentsApi.createPublicAppointment).mockResolvedValue(fakeAppointment);
      vi.mocked(paymentsApi.PaymentsApi.createPublicPayment).mockResolvedValue(fakePayment);

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

    it("should format date as yyyy-MM-dd and pass correct payload", async () => {
      vi.mocked(api.AppointmentsApi.createPublicAppointment).mockResolvedValue(fakeAppointment);
      vi.mocked(paymentsApi.PaymentsApi.createPublicPayment).mockResolvedValue(fakePayment);

      await SubmitPayment.submitPayment(baseParams);

      expect(api.AppointmentsApi.createPublicAppointment).toHaveBeenCalledWith({
        email: "user@test.com",
        date: "2026-03-15",
        startTime: "10:00",
        duration: 120,
        serviceId: 1,
        recurrenceType: undefined,
        weeklyFrequency: undefined,
        locationZip: undefined,
        locationAddress: undefined,
      });
    });

    it("should map recurrenceType 'avulso' to 'SINGLE'", async () => {
      vi.mocked(api.AppointmentsApi.createPublicAppointment).mockResolvedValue(fakeAppointment);
      vi.mocked(paymentsApi.PaymentsApi.createPublicPayment).mockResolvedValue(fakePayment);

      await SubmitPayment.submitPayment({ ...baseParams, recurrenceType: "avulso" });

      const payload = vi.mocked(api.AppointmentsApi.createPublicAppointment).mock.calls[0][0];
      expect(payload.recurrenceType).toBe("SINGLE");
    });
  });

  describe("error handling", () => {
    it("should return error on appointment creation failure", async () => {
      vi.mocked(api.AppointmentsApi.createPublicAppointment).mockRejectedValue(
        new Error("Request failed"),
      );

      const result = await SubmitPayment.submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Request failed" });
    });

    it("should return fallback error message for non-Error throws", async () => {
      vi.mocked(api.AppointmentsApi.createPublicAppointment).mockRejectedValue("unknown");

      const result = await SubmitPayment.submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Erro ao criar agendamento." });
    });

    it("should propagate payment API errors", async () => {
      vi.mocked(api.AppointmentsApi.createPublicAppointment).mockResolvedValue(fakeAppointment);
      vi.mocked(paymentsApi.PaymentsApi.createPublicPayment).mockRejectedValue(
        new Error("Payment failed"),
      );

      const result = await SubmitPayment.submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Payment failed" });
    });
  });
});
