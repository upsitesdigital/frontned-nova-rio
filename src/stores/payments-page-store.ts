import { create } from "zustand";

import {
  fetchClientPayments,
  type PaymentEntry,
  type PaymentStatus,
} from "@/api/payments-api";
import { getAuthToken } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

type FilterValue = "ALL" | PaymentStatus;

interface PaymentsPageState {
  payments: PaymentEntry[];
  total: number;
  page: number;
  limit: number;
  filter: FilterValue;
  isLoading: boolean;
  error: string | null;
}

interface PaymentsPageActions {
  loadPayments: () => Promise<void>;
  setFilter: (filter: FilterValue) => void;
  setPage: (page: number) => void;
}

type PaymentsPageStore = PaymentsPageState & PaymentsPageActions;

let currentController: AbortController | null = null;

const usePaymentsPageStore = create<PaymentsPageStore>()((set, get) => ({
  payments: [],
  total: 0,
  page: 1,
  limit: 20,
  filter: "ALL",
  isLoading: false,
  error: null,

  loadPayments: async () => {
    if (currentController) {
      currentController.abort();
    }
    const controller = new AbortController();
    currentController = controller;

    const token = await getAuthToken();
    if (!token) return;

    const { page, limit, filter } = get();
    const status = filter === "ALL" ? undefined : (filter as PaymentStatus);

    set({ isLoading: true, error: null });
    try {
      const result = await fetchClientPayments(token, page, limit, status, controller.signal);
      if (controller.signal.aborted) return;
      set({ payments: result.data, total: result.total });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      set({ error: MESSAGES.payments.loadError });
    } finally {
      if (!controller.signal.aborted) {
        set({ isLoading: false });
      }
      if (currentController === controller) {
        currentController = null;
      }
    }
  },

  setFilter: (filter) => {
    set({ filter, page: 1 });
    get().loadPayments();
  },

  setPage: (page) => {
    set({ page });
    get().loadPayments();
  },
}));

export { usePaymentsPageStore, type PaymentsPageStore, type FilterValue };
