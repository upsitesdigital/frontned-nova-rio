import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/payments-api", () => ({
  fetchClientPayments: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    payments: {
      loadError: "Erro ao carregar pagamentos.",
    },
  },
}));

const { fetchClientPayments } = await import("@/api/payments-api");

import { usePaymentsPageStore } from "./payments-page-store";

const mockPayments = [
  { id: 1, amount: 100, status: "PAID" },
  { id: 2, amount: 200, status: "PENDING" },
];

describe("PaymentsPageStore", () => {
  beforeEach(() => {
    usePaymentsPageStore.setState({
      payments: [],
      total: 0,
      page: 1,
      limit: 20,
      filter: "ALL",
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = usePaymentsPageStore.getState();

      expect(state.payments).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.page).toBe(1);
      expect(state.limit).toBe(20);
      expect(state.filter).toBe("ALL");
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("loadPayments", () => {
    it("should load payments on success", async () => {
      vi.mocked(fetchClientPayments).mockResolvedValue({
        data: mockPayments as never,
        total: 2,
        page: 1,
        limit: 20,
      });

      await usePaymentsPageStore.getState().loadPayments();

      const state = usePaymentsPageStore.getState();
      expect(state.payments).toEqual(mockPayments);
      expect(state.total).toBe(2);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should pass filter as status when not ALL", async () => {
      vi.mocked(fetchClientPayments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      });
      usePaymentsPageStore.setState({ filter: "PAID" as never });

      await usePaymentsPageStore.getState().loadPayments();

      expect(fetchClientPayments).toHaveBeenCalledWith(1, 20, "PAID", expect.any(AbortSignal));
    });

    it("should pass undefined status when filter is ALL", async () => {
      vi.mocked(fetchClientPayments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      });

      await usePaymentsPageStore.getState().loadPayments();

      expect(fetchClientPayments).toHaveBeenCalledWith(1, 20, undefined, expect.any(AbortSignal));
    });

    it("should set error on non-abort failure", async () => {
      vi.mocked(fetchClientPayments).mockRejectedValue(new Error("Network error"));

      await usePaymentsPageStore.getState().loadPayments();

      const state = usePaymentsPageStore.getState();
      expect(state.error).toBe("Erro ao carregar pagamentos.");
      expect(state.isLoading).toBe(false);
    });

    it("should not set error on AbortError", async () => {
      const abortError = new DOMException("Aborted", "AbortError");
      vi.mocked(fetchClientPayments).mockRejectedValue(abortError);

      await usePaymentsPageStore.getState().loadPayments();

      expect(usePaymentsPageStore.getState().error).toBeNull();
    });
  });

  describe("setFilter", () => {
    it("should update filter, reset page to 1, and trigger load", async () => {
      vi.mocked(fetchClientPayments).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
      usePaymentsPageStore.setState({ page: 3 });

      usePaymentsPageStore.getState().setFilter("PAID" as never);

      const state = usePaymentsPageStore.getState();
      expect(state.filter).toBe("PAID");
      expect(state.page).toBe(1);
      expect(fetchClientPayments).toHaveBeenCalled();
    });
  });

  describe("setPage", () => {
    it("should update page and trigger load", async () => {
      vi.mocked(fetchClientPayments).mockResolvedValue({ data: [], total: 0, page: 5, limit: 20 });

      usePaymentsPageStore.getState().setPage(5);

      expect(usePaymentsPageStore.getState().page).toBe(5);
      expect(fetchClientPayments).toHaveBeenCalled();
    });
  });
});
