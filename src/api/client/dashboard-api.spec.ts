import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    authGet: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { DashboardApi } from "./dashboard-api";

describe("dashboard-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchClientDashboardSummary", () => {
    it("should call httpAuthGet with /client/dashboard/summary", async () => {
      const summary = {
        clientName: "Maria",
        nextAppointment: null,
        appointmentsCount: 3,
        appointmentsCountLabel: "3 agendamentos",
        serviceHistory: [],
      };
      vi.mocked(HttpClient.authGet).mockResolvedValue(summary);

      const result = await DashboardApi.fetchClientDashboardSummary();

      expect(HttpClient.authGet).toHaveBeenCalledWith("/client/dashboard/summary");
      expect(result).toEqual(summary);
    });
  });
});
