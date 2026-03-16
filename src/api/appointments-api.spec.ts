import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpPost: vi.fn(),
  httpAuthPatch: vi.fn(),
  httpAuthPost: vi.fn(),
}));

const { httpPost, httpAuthPatch, httpAuthPost } = await import("./http-client");

import {
  createPublicAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "./appointments-api";

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
      vi.mocked(httpPost).mockResolvedValue(response);

      const result = await createPublicAppointment(data);

      expect(httpPost).toHaveBeenCalledWith("/appointments/public", data);
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
      vi.mocked(httpPost).mockResolvedValue({ id: 2 });

      await createPublicAppointment(data);

      expect(httpPost).toHaveBeenCalledWith("/appointments/public", data);
    });
  });

  describe("rescheduleAppointment", () => {
    it("should call httpAuthPost with /appointments/:id/reschedule", async () => {
      const data = { date: "2026-04-05", startTime: "14:00" };
      const response = { id: 7, uuid: "xyz", date: "2026-04-05", startTime: "14:00" };
      vi.mocked(httpAuthPost).mockResolvedValue(response);

      const result = await rescheduleAppointment(7, data);

      expect(httpAuthPost).toHaveBeenCalledWith("/appointments/7/reschedule", data);
      expect(result).toEqual(response);
    });
  });

  describe("cancelAppointment", () => {
    it("should call httpAuthPatch with /appointments/:id/cancel", async () => {
      vi.mocked(httpAuthPatch).mockResolvedValue(undefined);

      await cancelAppointment(42);

      expect(httpAuthPatch).toHaveBeenCalledWith("/appointments/42/cancel");
    });
  });
});
