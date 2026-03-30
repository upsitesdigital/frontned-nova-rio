import { create } from "zustand";
import { loadAdminClients, type LoadAdminClientsInput } from "@/use-cases/load-admin-clients";
import { approveAdminClient } from "@/use-cases/approve-admin-client";
import { rejectAdminClient } from "@/use-cases/reject-admin-client";
import type { DsClientTableClient, DsClientTableFilter } from "@/design-system";

const PAGE_SIZE = 20;

interface AdminClientsState {
  clients: DsClientTableClient[];
  totalClients: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  isAuthError: boolean;
  statusFilter: DsClientTableFilter;
  searchQuery: string;
  selectedClient: DsClientTableClient | null;
  isApproving: boolean;
  isRejecting: boolean;
}

interface AdminClientsActions {
  loadClients: () => Promise<void>;
  setStatusFilter: (filter: DsClientTableFilter) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  openApprovalPopup: (client: DsClientTableClient) => void;
  closeApprovalPopup: () => void;
  approveSelectedClient: () => Promise<void>;
  rejectSelectedClient: () => Promise<void>;
}

type AdminClientsStore = AdminClientsState & AdminClientsActions;

const useAdminClientsStore = create<AdminClientsStore>((set, get) => ({
  clients: [],
  totalClients: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  isAuthError: false,
  statusFilter: "all",
  searchQuery: "",
  selectedClient: null,
  isApproving: false,
  isRejecting: false,

  loadClients: async () => {
    const { statusFilter, searchQuery, currentPage } = get();

    set({ isLoading: true, error: null, isAuthError: false });

    const input: LoadAdminClientsInput = {
      page: currentPage,
      limit: PAGE_SIZE,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    };

    const result = await loadAdminClients(input);

    if (result.data) {
      set({
        clients: result.data.clients,
        totalClients: result.data.total,
        isLoading: false,
      });
    } else {
      set({
        isLoading: false,
        error: result.error,
        isAuthError: result.isAuthError,
      });
    }
  },

  setStatusFilter: (filter: DsClientTableFilter) => {
    set({ statusFilter: filter, currentPage: 1 });
    get().loadClients();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().loadClients();
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().loadClients();
  },

  openApprovalPopup: (client: DsClientTableClient) => {
    set({ selectedClient: client });
  },

  closeApprovalPopup: () => {
    set({ selectedClient: null });
  },

  approveSelectedClient: async () => {
    const { selectedClient } = get();
    if (!selectedClient) return;
    if (selectedClient.status !== "pending") {
      set({
        error: "Apenas clientes pendentes podem ser aprovados.",
        selectedClient: null,
      });
      return;
    }

    set({ isApproving: true });

    const result = await approveAdminClient(selectedClient.id);

    if (result.success) {
      set({ selectedClient: null, isApproving: false });
      get().loadClients();
    } else {
      set({ isApproving: false, error: result.error });
    }
  },

  rejectSelectedClient: async () => {
    const { selectedClient } = get();
    if (!selectedClient) return;
    if (selectedClient.status !== "pending") {
      set({
        error: "Apenas clientes pendentes podem ser reprovados.",
        selectedClient: null,
      });
      return;
    }

    set({ isRejecting: true });

    const result = await rejectAdminClient(selectedClient.id);

    if (result.success) {
      set({ selectedClient: null, isRejecting: false });
      get().loadClients();
    } else {
      set({ isRejecting: false, error: result.error });
    }
  },
}));

export { useAdminClientsStore, type AdminClientsStore, PAGE_SIZE };
