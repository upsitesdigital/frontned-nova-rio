import { create } from "zustand";
import { fetchAdminEmployees, type AdminEmployee, type EmployeeStatus } from "@/api/admin-employees-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";

type StatusFilter = "all" | EmployeeStatus;

const PAGE_SIZE = 20;

interface AdminEmployeesState {
  employees: AdminEmployee[];
  totalEmployees: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  isAuthError: boolean;
  statusFilter: StatusFilter;
  searchQuery: string;
}

interface AdminEmployeesActions {
  loadEmployees: () => Promise<void>;
  setStatusFilter: (filter: StatusFilter) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

type AdminEmployeesStore = AdminEmployeesState & AdminEmployeesActions;

const useAdminEmployeesStore = create<AdminEmployeesStore>((set, get) => ({
  employees: [],
  totalEmployees: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  isAuthError: false,
  statusFilter: "all",
  searchQuery: "",

  loadEmployees: async () => {
    const { statusFilter, searchQuery, currentPage } = get();

    set({ isLoading: true, error: null, isAuthError: false });

    try {
      const response = await fetchAdminEmployees({
        page: currentPage,
        limit: PAGE_SIZE,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchQuery || undefined,
      });

      set({
        employees: response.data,
        totalEmployees: response.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: resolveErrorMessage(error, "Erro ao carregar funcionários"),
        isAuthError: isAuthError(error),
      });
    }
  },

  setStatusFilter: (filter: StatusFilter) => {
    set({ statusFilter: filter, currentPage: 1 });
    get().loadEmployees();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().loadEmployees();
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().loadEmployees();
  },
}));

export { useAdminEmployeesStore, type AdminEmployeesStore, type StatusFilter, PAGE_SIZE };
