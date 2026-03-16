import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/cards-api", () => ({
  listCards: vi.fn(),
}));

vi.mock("@/api/payments-api", () => ({
  fetchClientPayments: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { dashboard: { paymentsLoadError: "Payments load error" } },
}));

const cardsApi = await import("@/api/cards-api");
const paymentsApi = await import("@/api/payments-api");
const { loadDashboardPayments } = await import("./load-dashboard-payments");

describe("loadDashboardPayments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return cards and payments on success", async () => {
    const cards = [{ id: 1, lastFourDigits: "1234", brand: "Visa" }] as never[];
    const payments = [{ id: 10, amount: "100.00" }] as never[];

    vi.mocked(cardsApi.listCards).mockResolvedValue(cards);
    vi.mocked(paymentsApi.fetchClientPayments).mockResolvedValue({
      data: payments,
      total: 1,
      page: 1,
      limit: 5,
    });

    const result = await loadDashboardPayments();

    expect(result.cards).toEqual(cards);
    expect(result.payments).toEqual(payments);
    expect(result.error).toBeNull();
  });

  it("should call fetchClientPayments with page 1 and limit 5", async () => {
    vi.mocked(cardsApi.listCards).mockResolvedValue([]);
    vi.mocked(paymentsApi.fetchClientPayments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    });

    await loadDashboardPayments();

    expect(paymentsApi.fetchClientPayments).toHaveBeenCalledWith(1, 5);
  });

  it("should return empty arrays and error when listCards fails", async () => {
    vi.mocked(cardsApi.listCards).mockRejectedValue(new Error("Network"));
    vi.mocked(paymentsApi.fetchClientPayments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    });

    const result = await loadDashboardPayments();

    expect(result.cards).toEqual([]);
    expect(result.payments).toEqual([]);
    expect(result.error).toBe("Payments load error");
  });

  it("should return empty arrays and error when fetchClientPayments fails", async () => {
    vi.mocked(cardsApi.listCards).mockResolvedValue([]);
    vi.mocked(paymentsApi.fetchClientPayments).mockRejectedValue(new Error("Server error"));

    const result = await loadDashboardPayments();

    expect(result.cards).toEqual([]);
    expect(result.payments).toEqual([]);
    expect(result.error).toBe("Payments load error");
  });

  it("should return empty cards and payments when both APIs return empty", async () => {
    vi.mocked(cardsApi.listCards).mockResolvedValue([]);
    vi.mocked(paymentsApi.fetchClientPayments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    });

    const result = await loadDashboardPayments();

    expect(result.cards).toEqual([]);
    expect(result.payments).toEqual([]);
    expect(result.error).toBeNull();
  });
});
