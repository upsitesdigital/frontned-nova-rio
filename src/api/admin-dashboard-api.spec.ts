import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
}));

const { httpAuthGet } = await import("./http-client");

import {
  fetchTodayAppointmentsCount,
  fetchActiveClientsCount,
  fetchPendingAppointmentsCount,
  fetchTodayAgenda,
  fetchAdminDashboardServices,
} from "./admin-dashboard-api";
import { fetchAdminProfile } from "./auth-api";

describe("admin-dashboard-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminProfile", () => {
    it("should call httpAuthGet with /auth/me", async () => {
      const profile = { id: 1, name: "Admin" };
      vi.mocked(httpAuthGet).mockResolvedValue(profile);

      const result = await fetchAdminProfile();

      expect(httpAuthGet).toHaveBeenCalledWith("/auth/me");
      expect(result).toEqual(profile);
    });
  });

  describe("fetchTodayAppointmentsCount", () => {
    it("should call correct endpoint", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ count: 5 });

      const result = await fetchTodayAppointmentsCount();

      expect(httpAuthGet).toHaveBeenCalledWith("/admin/dashboard/today-appointments-count");
      expect(result.count).toBe(5);
    });
  });

  describe("fetchActiveClientsCount", () => {
    it("should call correct endpoint", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ count: 10 });

      const result = await fetchActiveClientsCount();

      expect(httpAuthGet).toHaveBeenCalledWith("/admin/dashboard/active-clients-count");
      expect(result.count).toBe(10);
    });
  });

  describe("fetchPendingAppointmentsCount", () => {
    it("should call correct endpoint", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ count: 3 });

      const result = await fetchPendingAppointmentsCount();

      expect(httpAuthGet).toHaveBeenCalledWith("/admin/dashboard/pending-appointments-count");
      expect(result.count).toBe(3);
    });
  });

  describe("fetchTodayAgenda", () => {
    it("should build query params with page and limit", async () => {
      const agenda = { items: [], total: 0, page: 1, limit: 6 };
      vi.mocked(httpAuthGet).mockResolvedValue(agenda);

      await fetchTodayAgenda(1, 6);

      expect(httpAuthGet).toHaveBeenCalledWith(
        "/admin/dashboard/today-agenda?page=1&limit=6",
        undefined,
      );
    });

    it("should include serviceId when provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });

      await fetchTodayAgenda(2, 6, 5);

      const call = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(call).toContain("serviceId=5");
      expect(call).toContain("page=2");
    });

    it("should include serviceId=0 when explicitly passed", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });

      await fetchTodayAgenda(1, 6, 0);

      const call = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(call).toContain("serviceId=0");
    });

    it("should forward AbortSignal", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });
      const controller = new AbortController();

      await fetchTodayAgenda(1, 6, undefined, controller.signal);

      expect(httpAuthGet).toHaveBeenCalledWith(expect.any(String), controller.signal);
    });
  });

  describe("fetchAdminDashboardServices", () => {
    it("should return raw service data without filtering", async () => {
      const rawData = [
        { id: 1, name: "Limpeza", isActive: true },
        { id: 2, name: "Inativo", isActive: false },
        { id: 3, name: "Jardinagem", isActive: true },
      ];
      vi.mocked(httpAuthGet).mockResolvedValue({ data: rawData });

      const result = await fetchAdminDashboardServices();

      expect(result).toEqual(rawData);
    });

    it("should call /services endpoint", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [] });

      await fetchAdminDashboardServices();

      expect(httpAuthGet).toHaveBeenCalledWith("/services");
    });
  });
});
