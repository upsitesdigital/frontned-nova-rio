import { create } from "zustand";

import {
  fetchClientPayments,
  type PaymentEntry,
  type PaymentStatus,
} from "@/api/payments-api";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";

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

const usePaymentsPageStore = create<PaymentsPageStore>()((set, get) => ({
  payments: [],
  total: 0,
  page: 1,
  limit: 20,
  filter: "ALL",
  isLoading: false,
  error: null,

  loadPayments: async () => {
    await waitForAuthHydration();
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    const { page, limit, filter } = get();
    const status = filter === "ALL" ? undefined : (filter as PaymentStatus);

    set({ isLoading: true, error: null });
    try {
      const result = await fetchClientPayments(token, page, limit, status);
      set({ payments: result.data, total: result.total });
    } catch {
      set({ error: "Erro ao carregar pagamentos" });
    } finally {
      set({ isLoading: false });
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
