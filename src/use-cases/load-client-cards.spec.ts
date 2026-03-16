import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/cards-api", () => ({
  listCards: vi.fn(),
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
  MESSAGES: { cards: { loadError: "Cards load error" } },
}));

const api = await import("@/api/cards-api");
const { loadClientCards } = await import("./load-client-cards");

describe("loadClientCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return cards on success", async () => {
    const cards = [
      { id: 1, uuid: "u1", lastFourDigits: "1234", brand: "Visa", holderName: "John", expiryMonth: 12, expiryYear: 2027, isDefault: true },
    ] as never[];
    vi.mocked(api.listCards).mockResolvedValue(cards);

    const result = await loadClientCards();

    expect(result.data).toEqual(cards);
    expect(result.error).toBeNull();
  });

  it("should return empty array when API returns no cards", async () => {
    vi.mocked(api.listCards).mockResolvedValue([]);

    const result = await loadClientCards();

    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.listCards).mockRejectedValue(new Error("Network error"));

    const result = await loadClientCards();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Cards load error");
  });

  it("should call listCards exactly once", async () => {
    vi.mocked(api.listCards).mockResolvedValue([]);

    await loadClientCards();

    expect(api.listCards).toHaveBeenCalledTimes(1);
  });
});
