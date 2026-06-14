import { create } from "zustand";
import type { AdminPayment } from "@/api/admin/admin-payments-api";
import { LoadAdminPayments, type AdminPaymentsFilter, type AdminPaymentsMethodFilter } from "@/use-cases/admin-reports/load-admin-payments";
import { LoadAdminPaymentDetail } from "@/use-cases/admin-reports/load-admin-payment-detail";

const pageSize = 10;

interface AdminPaymentsState {
  payments: AdminPayment[];
  total: number;
  page: number;
  statusFilter: AdminPaymentsFilter;
  methodFilter: AdminPaymentsMethodFilter;
  dateFrom: string;
  dateTo: string;
  selectedPaymentId: number | null;
  selectedPayment: AdminPayment | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  isAuthError: boolean;
}

interface AdminPaymentsActions {
  loadPayments: () => Promise<void>;
  setStatusFilter: (value: AdminPaymentsFilter) => void;
  setMethodFilter: (value: AdminPaymentsMethodFilter) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  openDetails: (paymentId: number) => Promise<void>;
  closeDetails: () => void;
  reset: () => void;
}

type AdminPaymentsStore = AdminPaymentsState & AdminPaymentsActions;

const initialState: AdminPaymentsState = {
  payments: [],
  total: 0,
  page: 1,
  statusFilter: "all",
  methodFilter: "all",
  dateFrom: "",
  dateTo: "",
  selectedPaymentId: null,
  selectedPayment: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  detailError: null,
  isAuthError: false,
};

let listAbortController: AbortController | null = null;
let listLoadRequestId = 0;
let detailLoadRequestId = 0;

const useAdminPaymentsStore = create<AdminPaymentsStore>()((set, get) => ({
  ...initialState,

  loadPayments: async () => {
    listAbortController?.abort();
    listAbortController = new AbortController();
    const requestId = ++listLoadRequestId;
    const signal = listAbortController.signal;

    const { page, statusFilter, methodFilter, dateFrom, dateTo } = get();

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await LoadAdminPayments.loadAdminPayments({
      page,
      pageSize: pageSize,
      statusFilter,
      methodFilter,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      signal,
    });

    if (signal.aborted || requestId !== listLoadRequestId) {
      return;
    }

    if (result.data) {
      set({
        payments: result.data.payments,
        total: result.data.total,
        page: result.data.page,
        isLoading: false,
      });
      return;
    }

    if (result.error) {
      set({
        isLoading: false,
        error: result.error,
        isAuthError: result.isAuthError,
      });
      return;
    }

    set({ isLoading: false });
  },

  setStatusFilter: (value) => {
    set({ statusFilter: value, page: 1 });
    get().loadPayments();
  },

  setMethodFilter: (value) => {
    set({ methodFilter: value, page: 1 });
    get().loadPayments();
  },

  setDateFrom: (value) => {
    set({ dateFrom: value, page: 1 });
    get().loadPayments();
  },

  setDateTo: (value) => {
    set({ dateTo: value, page: 1 });
    get().loadPayments();
  },

  clearFilters: () => {
    set({
      statusFilter: "all",
      methodFilter: "all",
      dateFrom: "",
      dateTo: "",
      page: 1,
    });
    get().loadPayments();
  },

  setPage: (page) => {
    set({ page });
    get().loadPayments();
  },

  openDetails: async (paymentId) => {
    const requestId = ++detailLoadRequestId;

    set({
      selectedPaymentId: paymentId,
      selectedPayment: null,
      isDetailLoading: true,
      detailError: null,
      isAuthError: false,
    });

    const result = await LoadAdminPaymentDetail.loadAdminPaymentDetail(paymentId);

    if (requestId !== detailLoadRequestId) {
      return;
    }

    if (result.data) {
      set({ selectedPayment: result.data, isDetailLoading: false });
      return;
    }

    set({
      isDetailLoading: false,
      detailError: result.error,
      isAuthError: result.isAuthError,
    });
  },

  closeDetails: () => {
    set({
      selectedPaymentId: null,
      selectedPayment: null,
      isDetailLoading: false,
      detailError: null,
    });
  },

  reset: () => {
    listAbortController?.abort();
    listLoadRequestId++;
    detailLoadRequestId++;
    listAbortController = null;
    set(initialState);
  },
}));

export { useAdminPaymentsStore, pageSize, type AdminPaymentsStore };
