import { create } from "zustand";

import type { PaymentEntry, PaymentStatus } from "@/api/client/payments-api";
import { LoadClientPayments } from "@/use-cases/client-dashboard/load-client-payments";
import { DownloadReceipt } from "@/use-cases/client-cards/download-receipt";
import { useToastStore } from "@/stores/ui/toast-store";

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
  downloadReceipt: (paymentId: number) => Promise<void>;
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

    const { page, limit, filter } = get();
    const status = filter === "ALL" ? undefined : (filter as PaymentStatus);

    set({ isLoading: true, error: null });

    const result = await LoadClientPayments.loadClientPayments({
      page,
      limit,
      status,
      signal: controller.signal,
    });

    if (controller.signal.aborted) return;

    if (result.data) {
      set({ payments: result.data.payments, total: result.data.total, isLoading: false });
    } else if (result.error) {
      set({ error: result.error, isLoading: false });
    } else {
      set({ isLoading: false });
    }

    if (currentController === controller) {
      currentController = null;
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

  downloadReceipt: async (paymentId) => {
    try {
      await DownloadReceipt.downloadReceipt(paymentId);
    } catch {
      useToastStore.getState().showToast("Recibo não disponível para este pagamento.", "error");
    }
  },
}));

export { usePaymentsPageStore, type PaymentsPageStore, type FilterValue };
