import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/appointments-api", () => ({
  createPublicAppointment: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
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

const api = await import("@/api/appointments-api");
const { submitPayment } = await import("./submit-payment");

const baseParams = {
  email: "user@test.com",
  selectedServiceId: 1,
  selectedDate: new Date(2026, 2, 15),
  selectedTime: "10:00",
  recurrenceType: null,
  cep: "",
  address: null,
};

const fakeResponse = {
  id: 1,
  uuid: "uuid-123",
  date: "2026-03-15",
  startTime: "10:00",
  duration: 120,
  status: "SCHEDULED",
  service: { id: 1, name: "Limpeza" },
  client: { id: 2, name: "John", email: "user@test.com" },
};

describe("submitPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return success with confirmation on valid submission", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      const result = await submitPayment(baseParams);

      expect(result).toEqual({
        success: true,
        confirmation: {
          serviceName: "Limpeza",
          date: "2026-03-15",
          startTime: "10:00",
        },
      });
    });

    it("should format date as yyyy-MM-dd and pass correct payload", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      await submitPayment(baseParams);

      expect(api.createPublicAppointment).toHaveBeenCalledWith({
        email: "user@test.com",
        date: "2026-03-15",
        startTime: "10:00",
        duration: 120,
        serviceId: 1,
        recurrenceType: undefined,
        locationZip: undefined,
        locationAddress: undefined,
      });
    });

    it("should map recurrenceType 'avulso' to 'SINGLE'", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      await submitPayment({ ...baseParams, recurrenceType: "avulso" });

      const payload = vi.mocked(api.createPublicAppointment).mock.calls[0][0];
      expect(payload.recurrenceType).toBe("SINGLE");
    });

    it("should map recurrenceType 'pacote' to 'PACKAGE'", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      await submitPayment({ ...baseParams, recurrenceType: "pacote" });

      const payload = vi.mocked(api.createPublicAppointment).mock.calls[0][0];
      expect(payload.recurrenceType).toBe("PACKAGE");
    });

    it("should map recurrenceType 'recorrencia' to 'RECURRING'", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      await submitPayment({ ...baseParams, recurrenceType: "recorrencia" });

      const payload = vi.mocked(api.createPublicAppointment).mock.calls[0][0];
      expect(payload.recurrenceType).toBe("RECURRING");
    });

    it("should format address as a single string when provided", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      await submitPayment({
        ...baseParams,
        cep: "20040-020",
        address: {
          cep: "20040-020",
          street: "Rua A",
          neighborhood: "Centro",
          city: "Rio de Janeiro",
          state: "RJ",
        },
      });

      const payload = vi.mocked(api.createPublicAppointment).mock.calls[0][0];
      expect(payload.locationZip).toBe("20040-020");
      expect(payload.locationAddress).toBe("Rua A, Centro, Rio de Janeiro - RJ");
    });
  });

  describe("error handling", () => {
    it("should return error with Error message on failure", async () => {
      vi.mocked(api.createPublicAppointment).mockRejectedValue(new Error("Request failed"));

      const result = await submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Request failed" });
    });

    it("should return fallback error message for non-Error throws", async () => {
      vi.mocked(api.createPublicAppointment).mockRejectedValue("unknown");

      const result = await submitPayment(baseParams);

      expect(result).toEqual({ success: false, error: "Erro ao criar agendamento." });
    });
  });

  describe("edge cases", () => {
    it("should send locationZip as undefined when cep is empty", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      await submitPayment({ ...baseParams, cep: "" });

      const payload = vi.mocked(api.createPublicAppointment).mock.calls[0][0];
      expect(payload.locationZip).toBeUndefined();
    });

    it("should send recurrenceType as undefined when null", async () => {
      vi.mocked(api.createPublicAppointment).mockResolvedValue(fakeResponse);

      await submitPayment({ ...baseParams, recurrenceType: null });

      const payload = vi.mocked(api.createPublicAppointment).mock.calls[0][0];
      expect(payload.recurrenceType).toBeUndefined();
    });
  });
});
