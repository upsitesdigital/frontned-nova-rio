import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGetBlob: vi.fn(),
}));

const { httpAuthGetBlob } = await import("./http-client");

import { fetchReceiptBlob } from "./receipts-api";

describe("receipts-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchReceiptBlob", () => {
    it("should call httpAuthGetBlob with correct payment URL", async () => {
      const blob = new Blob(["pdf-content"], { type: "application/pdf" });
      vi.mocked(httpAuthGetBlob).mockResolvedValue(blob);

      const result = await fetchReceiptBlob(42);

      expect(httpAuthGetBlob).toHaveBeenCalledWith("/clients/payments/42/receipt");
      expect(result).toBe(blob);
    });

    it("should interpolate different paymentId values into the URL", async () => {
      const blob = new Blob();
      vi.mocked(httpAuthGetBlob).mockResolvedValue(blob);

      await fetchReceiptBlob(999);

      expect(httpAuthGetBlob).toHaveBeenCalledWith("/clients/payments/999/receipt");
    });
  });
});
