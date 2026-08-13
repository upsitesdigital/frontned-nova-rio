import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/cards-api", () => ({
  removeCard: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
  HttpClientError: class HttpClientError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpClientError";
    }
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  isAuthError: (error: unknown) =>
    error instanceof Error &&
    "status" in error &&
    ((error as { status: number }).status === 401 || (error as { status: number }).status === 403),
  resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    cards: { removeError: "Remove card error" },
  },
}));

const api = await import("@/api/cards-api");
const { removeClientCard } = await import("./remove-client-card");

describe("removeClientCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return success when card is removed", async () => {
      vi.mocked(api.removeCard).mockResolvedValue(undefined);

      const result = await removeClientCard(42);

      expect(result).toEqual({ success: true, error: null });
    });

    it("should call removeCard API with correct cardId", async () => {
      vi.mocked(api.removeCard).mockResolvedValue(undefined);

      await removeClientCard(99);

      expect(api.removeCard).toHaveBeenCalledWith(99);
    });
  });

  describe("error handling", () => {
    it("should return error with fallback message on failure", async () => {
      vi.mocked(api.removeCard).mockRejectedValue(new Error("Network error"));

      const result = await removeClientCard(42);

      expect(result).toEqual({ success: false, error: "Remove card error" });
    });
  });
});
