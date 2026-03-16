import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminEmployeesStore } from "./admin-employees-store";

vi.mock("@/api/admin-employees-api", () => ({
  fetchAdminEmployees: vi.fn(),
}));

vi.mock("@/lib/auth-helpers", () => ({
  isAuthError: vi.fn((error: unknown) => {
    if (error && typeof error === "object" && "status" in error) {
      return (
        (error as { status: number }).status === 401 || (error as { status: number }).status === 403
      );
    }
    return false;
  }),
  resolveErrorMessage: vi.fn((_error: unknown, fallback: string) => fallback),
}));

const { fetchAdminEmployees } = await import("@/api/admin-employees-api");

function resetStore() {
  useAdminEmployeesStore.setState({
    employees: [],
    totalEmployees: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    isAuthError: false,
    statusFilter: "all",
    searchQuery: "",
  });
}

describe("AdminEmployeesStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("loadEmployees", () => {
    it("should load employees successfully", async () => {
      const employee = {
        id: 1,
        uuid: "uuid-1",
        name: "Carlos",
        email: "carlos@test.com",
        phone: "+5521999999999",
        cpf: "12345678901",
        address: "Rua Test",
        avatarUrl: null,
        status: "ACTIVE" as const,
        availabilityFrom: "08:00",
        availabilityTo: "18:00",
        notes: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-03-01T00:00:00.000Z",
        unit: { id: 1, name: "Centro" },
      };
      vi.mocked(fetchAdminEmployees).mockResolvedValue({
        data: [employee],
        total: 1,
        page: 1,
        limit: 20,
      });

      await useAdminEmployeesStore.getState().loadEmployees();

      const state = useAdminEmployeesStore.getState();
      expect(state.employees).toEqual([employee]);
      expect(state.totalEmployees).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should pass status filter when not 'all'", async () => {
      vi.mocked(fetchAdminEmployees).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      useAdminEmployeesStore.setState({ statusFilter: "ACTIVE" });
      await useAdminEmployeesStore.getState().loadEmployees();

      expect(fetchAdminEmployees).toHaveBeenCalledWith(
        expect.objectContaining({ status: "ACTIVE" }),
      );
    });

    it("should not pass status when filter is 'all'", async () => {
      vi.mocked(fetchAdminEmployees).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await useAdminEmployeesStore.getState().loadEmployees();

      expect(fetchAdminEmployees).toHaveBeenCalledWith(
        expect.objectContaining({ status: undefined }),
      );
    });

    it("should pass search query when set", async () => {
      vi.mocked(fetchAdminEmployees).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      useAdminEmployeesStore.setState({ searchQuery: "Carlos" });
      await useAdminEmployeesStore.getState().loadEmployees();

      expect(fetchAdminEmployees).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Carlos" }),
      );
    });

    it("should not pass search when query is empty", async () => {
      vi.mocked(fetchAdminEmployees).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await useAdminEmployeesStore.getState().loadEmployees();

      expect(fetchAdminEmployees).toHaveBeenCalledWith(
        expect.objectContaining({ search: undefined }),
      );
    });

    it("should set error on failure", async () => {
      vi.mocked(fetchAdminEmployees).mockRejectedValue(new Error("Network error"));

      await useAdminEmployeesStore.getState().loadEmployees();

      const state = useAdminEmployeesStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Erro ao carregar funcionários");
    });

    it("should set isAuthError on 401 error", async () => {
      const authError = Object.assign(new Error("Unauthorized"), { status: 401 });
      vi.mocked(fetchAdminEmployees).mockRejectedValue(authError);

      await useAdminEmployeesStore.getState().loadEmployees();

      const state = useAdminEmployeesStore.getState();
      expect(state.isAuthError).toBe(true);
    });
  });

  describe("setStatusFilter", () => {
    it("should update filter and reset page", async () => {
      vi.mocked(fetchAdminEmployees).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      useAdminEmployeesStore.setState({ currentPage: 3 });
      useAdminEmployeesStore.getState().setStatusFilter("INACTIVE");

      const state = useAdminEmployeesStore.getState();
      expect(state.statusFilter).toBe("INACTIVE");
      expect(state.currentPage).toBe(1);
    });
  });

  describe("setSearchQuery", () => {
    it("should update query and reset page", async () => {
      vi.mocked(fetchAdminEmployees).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      useAdminEmployeesStore.setState({ currentPage: 5 });
      useAdminEmployeesStore.getState().setSearchQuery("Ana");

      const state = useAdminEmployeesStore.getState();
      expect(state.searchQuery).toBe("Ana");
      expect(state.currentPage).toBe(1);
    });
  });

  describe("setCurrentPage", () => {
    it("should update page and trigger load", async () => {
      vi.mocked(fetchAdminEmployees).mockResolvedValue({ data: [], total: 0, page: 2, limit: 20 });

      useAdminEmployeesStore.getState().setCurrentPage(2);

      expect(useAdminEmployeesStore.getState().currentPage).toBe(2);
      expect(fetchAdminEmployees).toHaveBeenCalled();
    });
  });
});
