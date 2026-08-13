import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/client/cards-api", () => ({
  CardsApi: { listCards: vi.fn() },
}));

vi.mock("@/api/client/payments-api", () => ({
  PaymentsApi: { fetchClientPayments: vi.fn() },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: { dashboard: { paymentsLoadError: "Payments load error" } },
}));

const cardsApi = await import("@/api/client/cards-api");
const paymentsApi = await import("@/api/client/payments-api");
const { LoadDashboardPayments } = await import("./load-dashboard-payments");

describe("loadDashboardPayments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return cards and payments on success", async () => {
    const cards = [{ id: 1, lastFourDigits: "1234", brand: "Visa" }] as never[];
    const payments = [{ id: 10, amount: "100.00" }] as never[];

    vi.mocked(cardsApi.CardsApi.listCards).mockResolvedValue(cards);
    vi.mocked(paymentsApi.PaymentsApi.fetchClientPayments).mockResolvedValue({
      data: payments,
      total: 1,
      page: 1,
      limit: 5,
    });

    const result = await LoadDashboardPayments.loadDashboardPayments();

    expect(result.cards).toEqual(cards);
    expect(result.payments).toEqual(payments);
    expect(result.error).toBeNull();
  });

  it("should call fetchClientPayments with page 1 and limit 5", async () => {
    vi.mocked(cardsApi.CardsApi.listCards).mockResolvedValue([]);
    vi.mocked(paymentsApi.PaymentsApi.fetchClientPayments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    });

    await LoadDashboardPayments.loadDashboardPayments();

    expect(paymentsApi.PaymentsApi.fetchClientPayments).toHaveBeenCalledWith(1, 5);
  });

  it("should return empty arrays and error when listCards fails", async () => {
    vi.mocked(cardsApi.CardsApi.listCards).mockRejectedValue(new Error("Network"));
    vi.mocked(paymentsApi.PaymentsApi.fetchClientPayments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    });

    const result = await LoadDashboardPayments.loadDashboardPayments();

    expect(result.cards).toEqual([]);
    expect(result.payments).toEqual([]);
    expect(result.error).toBe("Payments load error");
  });

  it("should return empty arrays and error when fetchClientPayments fails", async () => {
    vi.mocked(cardsApi.CardsApi.listCards).mockResolvedValue([]);
    vi.mocked(paymentsApi.PaymentsApi.fetchClientPayments).mockRejectedValue(
      new Error("Server error"),
    );

    const result = await LoadDashboardPayments.loadDashboardPayments();

    expect(result.cards).toEqual([]);
    expect(result.payments).toEqual([]);
    expect(result.error).toBe("Payments load error");
  });

  it("should return empty cards and payments when both APIs return empty", async () => {
    vi.mocked(cardsApi.CardsApi.listCards).mockResolvedValue([]);
    vi.mocked(paymentsApi.PaymentsApi.fetchClientPayments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    });

    const result = await LoadDashboardPayments.loadDashboardPayments();

    expect(result.cards).toEqual([]);
    expect(result.payments).toEqual([]);
    expect(result.error).toBeNull();
  });
});
