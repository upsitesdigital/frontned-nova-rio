import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
}));

const { httpAuthGet } = await import("./http-client");

import {
  fetchAdminAppointments,
  fetchEmployeeOptions,
  fetchUnitOptions,
} from "./admin-appointments-api";

describe("admin-appointments-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminAppointments", () => {
    it("should call with page and limit params", async () => {
      const response = { data: [], total: 0, page: 1, limit: 10 };
      vi.mocked(httpAuthGet).mockResolvedValue(response);

      await fetchAdminAppointments({ page: 1, limit: 10 });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("/admin/appointments?");
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
    });

    it("should include date param when provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await fetchAdminAppointments({ page: 1, limit: 10, date: "2026-03-15" });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("date=2026-03-15");
    });

    it("should include weekStart and weekEnd params", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await fetchAdminAppointments({
        page: 1,
        limit: 10,
        weekStart: "2026-03-10",
        weekEnd: "2026-03-16",
      });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("weekStart=2026-03-10");
      expect(url).toContain("weekEnd=2026-03-16");
    });

    it("should include employeeId param", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await fetchAdminAppointments({ page: 1, limit: 10, employeeId: 5 });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("employeeId=5");
    });

    it("should include unitId param", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await fetchAdminAppointments({ page: 1, limit: 10, unitId: 3 });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("unitId=3");
    });

    it("should include status param", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await fetchAdminAppointments({ page: 1, limit: 10, status: "SCHEDULED" });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("status=SCHEDULED");
    });

    it("should not include optional params when not provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await fetchAdminAppointments({ page: 1, limit: 10 });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).not.toContain("date=");
      expect(url).not.toContain("weekStart=");
      expect(url).not.toContain("employeeId=");
      expect(url).not.toContain("unitId=");
      expect(url).not.toContain("status=");
    });

    it("should forward AbortSignal", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });
      const controller = new AbortController();

      await fetchAdminAppointments({ page: 1, limit: 10 }, controller.signal);

      expect(httpAuthGet).toHaveBeenCalledWith(expect.any(String), controller.signal);
    });
  });

  describe("fetchEmployeeOptions", () => {
    it("should filter active employees and map to options", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({
        data: [
          { id: 1, name: "Carlos", isActive: true },
          { id: 2, name: "Inativo", isActive: false },
          { id: 3, name: "Ana", isActive: true },
        ],
      });

      const result = await fetchEmployeeOptions();

      expect(result).toEqual([
        { id: 1, name: "Carlos" },
        { id: 3, name: "Ana" },
      ]);
    });

    it("should call /employees endpoint with limit", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [] });

      await fetchEmployeeOptions();

      expect(httpAuthGet).toHaveBeenCalledWith("/employees?limit=100");
    });
  });

  describe("fetchUnitOptions", () => {
    it("should filter active units and map to options", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({
        data: [
          { id: 1, name: "Centro", isActive: true },
          { id: 2, name: "Fechada", isActive: false },
        ],
      });

      const result = await fetchUnitOptions();

      expect(result).toEqual([{ id: 1, name: "Centro" }]);
    });

    it("should call /units endpoint with limit", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [] });

      await fetchUnitOptions();

      expect(httpAuthGet).toHaveBeenCalledWith("/units?limit=100");
    });
  });
});
