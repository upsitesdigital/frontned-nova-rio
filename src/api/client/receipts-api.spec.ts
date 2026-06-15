import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    authGetBlob: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { ReceiptsApi } from "./receipts-api";

describe("receipts-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchReceiptBlob", () => {
    it("should call httpAuthGetBlob with correct payment URL", async () => {
      const blob = new Blob(["pdf-content"], { type: "application/pdf" });
      vi.mocked(HttpClient.authGetBlob).mockResolvedValue(blob);

      const result = await ReceiptsApi.fetchReceiptBlob(42);

      expect(HttpClient.authGetBlob).toHaveBeenCalledWith("/clients/payments/42/receipt");
      expect(result).toBe(blob);
    });

    it("should interpolate different paymentId values into the URL", async () => {
      const blob = new Blob();
      vi.mocked(HttpClient.authGetBlob).mockResolvedValue(blob);

      await ReceiptsApi.fetchReceiptBlob(999);

      expect(HttpClient.authGetBlob).toHaveBeenCalledWith("/clients/payments/999/receipt");
    });
  });
});
