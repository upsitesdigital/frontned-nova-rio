import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
}));

const { httpAuthGet } = await import("./http-client");

import { fetchClientPayments } from "./payments-api";

describe("payments-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchClientPayments", () => {
    it("should call with page and limit params", async () => {
      const response = { data: [], total: 0, page: 1, limit: 10 };
      vi.mocked(httpAuthGet).mockResolvedValue(response);

      await fetchClientPayments(1, 10);

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("/payments?");
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
    });

    it("should include status param when provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 2, limit: 5 });

      await fetchClientPayments(2, 5, "APPROVED");

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("status=APPROVED");
      expect(url).toContain("page=2");
      expect(url).toContain("limit=5");
    });

    it("should not include status param when not provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await fetchClientPayments(1, 10);

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).not.toContain("status=");
    });

    it("should forward AbortSignal", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });
      const controller = new AbortController();

      await fetchClientPayments(1, 10, undefined, controller.signal);

      expect(httpAuthGet).toHaveBeenCalledWith(expect.any(String), controller.signal);
    });

    it("should return paginated response", async () => {
      const response = {
        data: [{ id: 1, uuid: "p1", amount: "100.00", method: "CREDIT_CARD", status: "APPROVED" }],
        total: 1,
        page: 1,
        limit: 10,
      };
      vi.mocked(httpAuthGet).mockResolvedValue(response);

      const result = await fetchClientPayments(1, 10);

      expect(result).toEqual(response);
    });
  });
});
