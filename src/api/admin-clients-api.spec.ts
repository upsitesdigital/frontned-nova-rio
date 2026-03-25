import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
  httpAuthPatch: vi.fn(),
}));

const { httpAuthGet, httpAuthPatch } = await import("./http-client");

import { fetchAdminClients, approveAdminClient, rejectAdminClient } from "./admin-clients-api";

describe("admin-clients-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminClients", () => {
    it("should call httpAuthGet with page and limit", async () => {
      const response = { data: [], total: 0, page: 1, limit: 20 };
      vi.mocked(httpAuthGet).mockResolvedValue(response);

      const result = await fetchAdminClients({ page: 1, limit: 20 });

      expect(httpAuthGet).toHaveBeenCalledWith("/clients?page=1&limit=20", undefined);
      expect(result).toEqual(response);
    });

    it("should include status param when provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await fetchAdminClients({ page: 1, limit: 20, status: "PENDING" });

      expect(httpAuthGet).toHaveBeenCalledWith(
        expect.stringContaining("status=PENDING"),
        undefined,
      );
    });

    it("should include search param when provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await fetchAdminClients({ page: 1, limit: 20, search: "Fábio" });

      expect(httpAuthGet).toHaveBeenCalledWith(
        expect.stringContaining("search=F%C3%A1bio"),
        undefined,
      );
    });

    it("should not include status when not provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await fetchAdminClients({ page: 1, limit: 10 });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).not.toContain("status=");
    });

    it("should forward abort signal", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
      const controller = new AbortController();

      await fetchAdminClients({ page: 1, limit: 20 }, controller.signal);

      expect(httpAuthGet).toHaveBeenCalledWith(expect.any(String), controller.signal);
    });
  });

  describe("approveAdminClient", () => {
    it("should call httpAuthPatch with correct path", async () => {
      vi.mocked(httpAuthPatch).mockResolvedValue(undefined);

      await approveAdminClient("42");

      expect(httpAuthPatch).toHaveBeenCalledWith("/clients/42/approve");
    });
  });

  describe("rejectAdminClient", () => {
    it("should call httpAuthPatch with correct path", async () => {
      vi.mocked(httpAuthPatch).mockResolvedValue(undefined);

      await rejectAdminClient("99");

      expect(httpAuthPatch).toHaveBeenCalledWith("/clients/99/reject");
    });
  });
});
