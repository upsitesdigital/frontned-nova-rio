import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminClientsStore } from "./admin-clients-store";
import type { DsClientTableClient } from "@/design-system";

vi.mock("@/use-cases/admin-clients/load-admin-clients", () => ({
  LoadAdminClients: {
    loadAdminClients: vi.fn(),
  },
}));

vi.mock("@/use-cases/admin-clients/approve-admin-client", () => ({
  ApproveAdminClient: {
    approveAdminClient: vi.fn(),
  },
}));

vi.mock("@/use-cases/admin-clients/reject-admin-client", () => ({
  RejectAdminClient: {
    rejectAdminClient: vi.fn(),
  },
}));

const { LoadAdminClients } = await import("@/use-cases/admin-clients/load-admin-clients");
const { ApproveAdminClient } = await import("@/use-cases/admin-clients/approve-admin-client");
const { RejectAdminClient } = await import("@/use-cases/admin-clients/reject-admin-client");

const mockClient: DsClientTableClient = {
  id: "1",
  name: "Fábio Moraes",
  company: "GreenLeaf",
  document: "222.555.888-07",
  unit: "Le Monde",
  status: "pending",
  registrationDate: "01/01/2026",
  email: "fabio@test.com",
};

function resetStore() {
  useAdminClientsStore.setState({
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
  });
}

describe("AdminClientsStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("loadClients", () => {
    it("should load clients successfully", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [mockClient], total: 1 },
        error: null,
        isAuthError: false,
      });

      await useAdminClientsStore.getState().loadClients();

      const state = useAdminClientsStore.getState();
      expect(state.clients).toEqual([mockClient]);
      expect(state.totalClients).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should pass status filter when not 'all'", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ statusFilter: "pending" });
      await useAdminClientsStore.getState().loadClients();

      expect(LoadAdminClients.loadAdminClients).toHaveBeenCalledWith(
        expect.objectContaining({ status: "pending" }),
      );
    });

    it("should not pass status when filter is 'all'", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      await useAdminClientsStore.getState().loadClients();

      expect(LoadAdminClients.loadAdminClients).toHaveBeenCalledWith(
        expect.objectContaining({ status: undefined }),
      );
    });

    it("should set error on failure", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: null,
        error: "Load error",
        isAuthError: false,
      });

      await useAdminClientsStore.getState().loadClients();

      const state = useAdminClientsStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Load error");
    });

    it("should set isAuthError on auth failure", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: null,
        error: "Session expired",
        isAuthError: true,
      });

      await useAdminClientsStore.getState().loadClients();

      expect(useAdminClientsStore.getState().isAuthError).toBe(true);
    });
  });

  describe("setStatusFilter", () => {
    it("should update filter and reset page", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ currentPage: 3 });
      useAdminClientsStore.getState().setStatusFilter("active");

      const state = useAdminClientsStore.getState();
      expect(state.statusFilter).toBe("active");
      expect(state.currentPage).toBe(1);
    });
  });

  describe("setSearchQuery", () => {
    it("should update query and reset page", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ currentPage: 5 });
      useAdminClientsStore.getState().setSearchQuery("Fábio");

      const state = useAdminClientsStore.getState();
      expect(state.searchQuery).toBe("Fábio");
      expect(state.currentPage).toBe(1);
    });
  });

  describe("setCurrentPage", () => {
    it("should update page and trigger load", async () => {
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.getState().setCurrentPage(2);

      expect(useAdminClientsStore.getState().currentPage).toBe(2);
      expect(LoadAdminClients.loadAdminClients).toHaveBeenCalled();
    });
  });

  describe("openApprovalPopup", () => {
    it("should set selectedClient", () => {
      useAdminClientsStore.getState().openApprovalPopup(mockClient);

      expect(useAdminClientsStore.getState().selectedClient).toEqual(mockClient);
    });
  });

  describe("closeApprovalPopup", () => {
    it("should clear selectedClient", () => {
      useAdminClientsStore.setState({ selectedClient: mockClient });

      useAdminClientsStore.getState().closeApprovalPopup();

      expect(useAdminClientsStore.getState().selectedClient).toBeNull();
    });
  });

  describe("approveSelectedClient", () => {
    it("should approve and close popup on success", async () => {
      vi.mocked(ApproveAdminClient.approveAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().approveSelectedClient();

      const state = useAdminClientsStore.getState();
      expect(ApproveAdminClient.approveAdminClient).toHaveBeenCalledWith("1");
      expect(state.selectedClient).toBeNull();
      expect(state.isApproving).toBe(false);
    });

    it("should reload clients after approval", async () => {
      vi.mocked(ApproveAdminClient.approveAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().approveSelectedClient();

      expect(LoadAdminClients.loadAdminClients).toHaveBeenCalled();
    });

    it("should set error on failure", async () => {
      vi.mocked(ApproveAdminClient.approveAdminClient).mockResolvedValue({
        success: false,
        error: "Approve failed",
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().approveSelectedClient();

      const state = useAdminClientsStore.getState();
      expect(state.error).toBe("Approve failed");
      expect(state.isApproving).toBe(false);
    });

    it("should do nothing when no client is selected", async () => {
      await useAdminClientsStore.getState().approveSelectedClient();

      expect(ApproveAdminClient.approveAdminClient).not.toHaveBeenCalled();
    });
  });

  describe("rejectSelectedClient", () => {
    it("should reject and close popup on success", async () => {
      vi.mocked(RejectAdminClient.rejectAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().rejectSelectedClient();

      const state = useAdminClientsStore.getState();
      expect(RejectAdminClient.rejectAdminClient).toHaveBeenCalledWith("1");
      expect(state.selectedClient).toBeNull();
      expect(state.isRejecting).toBe(false);
    });

    it("should reload clients after rejection", async () => {
      vi.mocked(RejectAdminClient.rejectAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(LoadAdminClients.loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().rejectSelectedClient();

      expect(LoadAdminClients.loadAdminClients).toHaveBeenCalled();
    });

    it("should set error on failure", async () => {
      vi.mocked(RejectAdminClient.rejectAdminClient).mockResolvedValue({
        success: false,
        error: "Reject failed",
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().rejectSelectedClient();

      const state = useAdminClientsStore.getState();
      expect(state.error).toBe("Reject failed");
      expect(state.isRejecting).toBe(false);
    });

    it("should do nothing when no client is selected", async () => {
      await useAdminClientsStore.getState().rejectSelectedClient();

      expect(RejectAdminClient.rejectAdminClient).not.toHaveBeenCalled();
    });
  });
});
