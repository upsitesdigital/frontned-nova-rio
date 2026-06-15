import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    authGet: vi.fn(),
    authPatch: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { AdminClientsApi } from "./admin-clients-api";

describe("admin-clients-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminClients", () => {
    it("should call httpAuthGet with page and limit", async () => {
      const response = { data: [], total: 0, page: 1, limit: 20 };
      vi.mocked(HttpClient.authGet).mockResolvedValue(response);

      const result = await AdminClientsApi.fetchAdminClients({ page: 1, limit: 20 });

      expect(HttpClient.authGet).toHaveBeenCalledWith("/clients?page=1&limit=20", undefined);
      expect(result).toEqual(response);
    });

    it("should include status param when provided", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await AdminClientsApi.fetchAdminClients({ page: 1, limit: 20, status: "PENDING" });

      expect(HttpClient.authGet).toHaveBeenCalledWith(
        expect.stringContaining("status=PENDING"),
        undefined,
      );
    });

    it("should include search param when provided", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await AdminClientsApi.fetchAdminClients({ page: 1, limit: 20, search: "Fábio" });

      expect(HttpClient.authGet).toHaveBeenCalledWith(
        expect.stringContaining("search=F%C3%A1bio"),
        undefined,
      );
    });

    it("should not include status when not provided", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await AdminClientsApi.fetchAdminClients({ page: 1, limit: 10 });

      const url = vi.mocked(HttpClient.authGet).mock.calls[0][0] as string;
      expect(url).not.toContain("status=");
    });

    it("should forward abort signal", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
      const controller = new AbortController();

      await AdminClientsApi.fetchAdminClients({ page: 1, limit: 20 }, controller.signal);

      expect(HttpClient.authGet).toHaveBeenCalledWith(expect.any(String), controller.signal);
    });
  });

  describe("approveAdminClient", () => {
    it("should call httpAuthPatch with correct path", async () => {
      vi.mocked(HttpClient.authPatch).mockResolvedValue(undefined);

      await AdminClientsApi.approveAdminClient("42");

      expect(HttpClient.authPatch).toHaveBeenCalledWith("/clients/42/approve");
    });
  });

  describe("rejectAdminClient", () => {
    it("should call httpAuthPatch with correct path", async () => {
      vi.mocked(HttpClient.authPatch).mockResolvedValue(undefined);

      await AdminClientsApi.rejectAdminClient("99");

      expect(HttpClient.authPatch).toHaveBeenCalledWith("/clients/99/reject");
    });
  });
});
