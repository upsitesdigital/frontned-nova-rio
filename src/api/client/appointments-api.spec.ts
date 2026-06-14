import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    post: vi.fn(),
    authPatch: vi.fn(),
    authPost: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { AppointmentsApi } from "./appointments-api";

describe("appointments-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPublicAppointment", () => {
    it("should call httpPost with /appointments/public and data", async () => {
      const data = {
        email: "client@test.com",
        date: "2026-04-01",
        startTime: "10:00",
        duration: 60,
        serviceId: 1,
      };
      const response = {
        id: 1,
        uuid: "abc",
        date: "2026-04-01",
        startTime: "10:00",
        duration: 60,
        status: "SCHEDULED",
        service: { id: 1, name: "Limpeza" },
        client: { id: 1, name: "Cliente", email: "client@test.com" },
      };
      vi.mocked(HttpClient.post).mockResolvedValue(response);

      const result = await AppointmentsApi.createPublicAppointment(data);

      expect(HttpClient.post).toHaveBeenCalledWith("/appointments/public", data);
      expect(result).toEqual(response);
    });

    it("should include optional fields when provided", async () => {
      const data = {
        email: "client@test.com",
        date: "2026-04-01",
        startTime: "10:00",
        duration: 60,
        serviceId: 1,
        recurrenceType: "WEEKLY",
        locationZip: "20000-000",
        locationAddress: "Rua A, 123",
      };
      vi.mocked(HttpClient.post).mockResolvedValue({ id: 2 });

      await AppointmentsApi.createPublicAppointment(data);

      expect(HttpClient.post).toHaveBeenCalledWith("/appointments/public", data);
    });
  });

  describe("rescheduleAppointment", () => {
    it("should call httpAuthPost with /appointments/:id/reschedule", async () => {
      const data = { date: "2026-04-05", startTime: "14:00" };
      const response = { id: 7, uuid: "xyz", date: "2026-04-05", startTime: "14:00" };
      vi.mocked(HttpClient.authPost).mockResolvedValue(response);

      const result = await AppointmentsApi.rescheduleAppointment(7, data);

      expect(HttpClient.authPost).toHaveBeenCalledWith("/appointments/7/reschedule", data);
      expect(result).toEqual(response);
    });
  });

  describe("cancelAppointment", () => {
    it("should call httpAuthPatch with /appointments/:id/cancel", async () => {
      vi.mocked(HttpClient.authPatch).mockResolvedValue(undefined);

      await AppointmentsApi.cancelAppointment(42);

      expect(HttpClient.authPatch).toHaveBeenCalledWith("/appointments/42/cancel");
    });
  });
});
