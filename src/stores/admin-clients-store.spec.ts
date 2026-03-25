import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminClientsStore } from "./admin-clients-store";
import type { DsClientTableClient } from "@/design-system";

vi.mock("@/use-cases/load-admin-clients", () => ({
  loadAdminClients: vi.fn(),
}));

vi.mock("@/use-cases/approve-admin-client", () => ({
  approveAdminClient: vi.fn(),
}));

vi.mock("@/use-cases/reject-admin-client", () => ({
  rejectAdminClient: vi.fn(),
}));

const { loadAdminClients } = await import("@/use-cases/load-admin-clients");
const { approveAdminClient } = await import("@/use-cases/approve-admin-client");
const { rejectAdminClient } = await import("@/use-cases/reject-admin-client");

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
      vi.mocked(loadAdminClients).mockResolvedValue({
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
      vi.mocked(loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ statusFilter: "pending" });
      await useAdminClientsStore.getState().loadClients();

      expect(loadAdminClients).toHaveBeenCalledWith(
        expect.objectContaining({ status: "pending" }),
      );
    });

    it("should not pass status when filter is 'all'", async () => {
      vi.mocked(loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      await useAdminClientsStore.getState().loadClients();

      expect(loadAdminClients).toHaveBeenCalledWith(
        expect.objectContaining({ status: undefined }),
      );
    });

    it("should set error on failure", async () => {
      vi.mocked(loadAdminClients).mockResolvedValue({
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
      vi.mocked(loadAdminClients).mockResolvedValue({
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
      vi.mocked(loadAdminClients).mockResolvedValue({
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
      vi.mocked(loadAdminClients).mockResolvedValue({
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
      vi.mocked(loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.getState().setCurrentPage(2);

      expect(useAdminClientsStore.getState().currentPage).toBe(2);
      expect(loadAdminClients).toHaveBeenCalled();
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
      vi.mocked(approveAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().approveSelectedClient();

      const state = useAdminClientsStore.getState();
      expect(approveAdminClient).toHaveBeenCalledWith("1");
      expect(state.selectedClient).toBeNull();
      expect(state.isApproving).toBe(false);
    });

    it("should reload clients after approval", async () => {
      vi.mocked(approveAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().approveSelectedClient();

      expect(loadAdminClients).toHaveBeenCalled();
    });

    it("should set error on failure", async () => {
      vi.mocked(approveAdminClient).mockResolvedValue({
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

      expect(approveAdminClient).not.toHaveBeenCalled();
    });
  });

  describe("rejectSelectedClient", () => {
    it("should reject and close popup on success", async () => {
      vi.mocked(rejectAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().rejectSelectedClient();

      const state = useAdminClientsStore.getState();
      expect(rejectAdminClient).toHaveBeenCalledWith("1");
      expect(state.selectedClient).toBeNull();
      expect(state.isRejecting).toBe(false);
    });

    it("should reload clients after rejection", async () => {
      vi.mocked(rejectAdminClient).mockResolvedValue({
        success: true,
        error: null,
        isAuthError: false,
      });
      vi.mocked(loadAdminClients).mockResolvedValue({
        data: { clients: [], total: 0 },
        error: null,
        isAuthError: false,
      });

      useAdminClientsStore.setState({ selectedClient: mockClient });
      await useAdminClientsStore.getState().rejectSelectedClient();

      expect(loadAdminClients).toHaveBeenCalled();
    });

    it("should set error on failure", async () => {
      vi.mocked(rejectAdminClient).mockResolvedValue({
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

      expect(rejectAdminClient).not.toHaveBeenCalled();
    });
  });
});
