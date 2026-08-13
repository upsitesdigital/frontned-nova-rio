import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/client/cards-api", () => ({
  CardsApi: { removeCard: vi.fn() },
}));

vi.mock("@/api/core/http-client", () => ({
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

vi.mock("@/lib/auth/auth-helpers", () => ({
  AuthHelpers: {
    isAuthError: (error: unknown) =>
      error instanceof Error &&
      "status" in error &&
      ((error as { status: number }).status === 401 ||
        (error as { status: number }).status === 403),
    resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
  },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: {
    cards: { removeError: "Remove card error" },
  },
}));

const api = await import("@/api/client/cards-api");
const { RemoveClientCard } = await import("./remove-client-card");

describe("removeClientCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return success when card is removed", async () => {
      vi.mocked(api.CardsApi.removeCard).mockResolvedValue(undefined);

      const result = await RemoveClientCard.removeClientCard(42);

      expect(result).toEqual({ success: true, error: null });
    });

    it("should call removeCard API with correct cardId", async () => {
      vi.mocked(api.CardsApi.removeCard).mockResolvedValue(undefined);

      await RemoveClientCard.removeClientCard(99);

      expect(api.CardsApi.removeCard).toHaveBeenCalledWith(99);
    });
  });

  describe("error handling", () => {
    it("should return error with fallback message on failure", async () => {
      vi.mocked(api.CardsApi.removeCard).mockRejectedValue(new Error("Network error"));

      const result = await RemoveClientCard.removeClientCard(42);

      expect(result).toEqual({ success: false, error: "Remove card error" });
    });
  });
});
