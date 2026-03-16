import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/load-dashboard-payments", () => ({
  loadDashboardPayments: vi.fn(),
}));

const { loadDashboardPayments } = await import("@/use-cases/load-dashboard-payments");

import { useDashboardPaymentsStore } from "./dashboard-payments-store";

const mockCards = [
  { id: 1, lastFourDigits: "1234", brand: "VISA", isDefault: true },
  { id: 2, lastFourDigits: "5678", brand: "MASTERCARD", isDefault: false },
];

const mockPayments = [
  { id: 1, amount: 100, status: "PAID" },
  { id: 2, amount: 200, status: "PENDING" },
];

describe("DashboardPaymentsStore", () => {
  beforeEach(() => {
    useDashboardPaymentsStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useDashboardPaymentsStore.getState();

      expect(state.cards).toEqual([]);
      expect(state.recentPayments).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("loadPaymentsData", () => {
    it("should load cards and payments on success", async () => {
      vi.mocked(loadDashboardPayments).mockResolvedValue({
        cards: mockCards as never,
        payments: mockPayments as never,
        error: null,
      });

      await useDashboardPaymentsStore.getState().loadPaymentsData();

      const state = useDashboardPaymentsStore.getState();
      expect(state.cards).toEqual(mockCards);
      expect(state.recentPayments).toEqual(mockPayments);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set error on failure", async () => {
      vi.mocked(loadDashboardPayments).mockResolvedValue({
        cards: [],
        payments: [],
        error: "Failed to load payments",
      });

      await useDashboardPaymentsStore.getState().loadPaymentsData();

      const state = useDashboardPaymentsStore.getState();
      expect(state.cards).toEqual([]);
      expect(state.recentPayments).toEqual([]);
      expect(state.error).toBe("Failed to load payments");
    });

    it("should set isLoading to true before API call", async () => {
      let resolvePromise!: (value: unknown) => void;
      vi.mocked(loadDashboardPayments).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }) as never,
      );

      const promise = useDashboardPaymentsStore.getState().loadPaymentsData();
      expect(useDashboardPaymentsStore.getState().isLoading).toBe(true);

      resolvePromise({ cards: [], payments: [], error: null });
      await promise;

      expect(useDashboardPaymentsStore.getState().isLoading).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useDashboardPaymentsStore.setState({
        cards: mockCards as never,
        recentPayments: mockPayments as never,
        isLoading: true,
        error: "error",
      });

      useDashboardPaymentsStore.getState().reset();

      const state = useDashboardPaymentsStore.getState();
      expect(state.cards).toEqual([]);
      expect(state.recentPayments).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
