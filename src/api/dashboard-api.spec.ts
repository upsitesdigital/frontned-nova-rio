import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
}));

const { httpAuthGet } = await import("./http-client");

import { fetchClientDashboardSummary } from "./dashboard-api";

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
      vi.mocked(httpAuthGet).mockResolvedValue(summary);

      const result = await fetchClientDashboardSummary();

      expect(httpAuthGet).toHaveBeenCalledWith("/client/dashboard/summary");
      expect(result).toEqual(summary);
    });
  });
});
