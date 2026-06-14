import { create } from "zustand";
import { LoadAdminClients, type LoadAdminClientsInput } from "@/use-cases/admin-clients/load-admin-clients";
import { ApproveAdminClient } from "@/use-cases/admin-clients/approve-admin-client";
import { RejectAdminClient } from "@/use-cases/admin-clients/reject-admin-client";
import type { DsClientTableClient, DsClientTableFilter } from "@/design-system";

const pageSize = 20;
let clientsLoadSeq = 0;

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
    const seq = ++clientsLoadSeq;

    set({ isLoading: true, error: null, isAuthError: false });

    const input: LoadAdminClientsInput = {
      page: currentPage,
      limit: pageSize,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    };

    const result = await LoadAdminClients.loadAdminClients(input);
    if (seq !== clientsLoadSeq) return;

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
    const { selectedClient, isApproving } = get();
    if (!selectedClient || isApproving) return;
    if (selectedClient.status !== "pending") {
      set({
        error: "Apenas clientes pendentes podem ser aprovados.",
        selectedClient: null,
      });
      return;
    }

    set({ isApproving: true });

    const result = await ApproveAdminClient.approveAdminClient(selectedClient.id);

    if (result.success) {
      set({ selectedClient: null, isApproving: false });
      get().loadClients();
    } else {
      set({ isApproving: false, error: result.error });
    }
  },

  rejectSelectedClient: async () => {
    const { selectedClient, isRejecting } = get();
    if (!selectedClient || isRejecting) return;
    if (selectedClient.status !== "pending") {
      set({
        error: "Apenas clientes pendentes podem ser reprovados.",
        selectedClient: null,
      });
      return;
    }

    set({ isRejecting: true });

    const result = await RejectAdminClient.rejectAdminClient(selectedClient.id);

    if (result.success) {
      set({ selectedClient: null, isRejecting: false });
      get().loadClients();
    } else {
      set({ isRejecting: false, error: result.error });
    }
  },
}));

export { useAdminClientsStore, type AdminClientsStore, pageSize };
