import { create } from "zustand";
import {
  loadAdminEmployees,
  type LoadAdminEmployeesInput,
} from "@/use-cases/load-admin-employees";
import type { AdminEmployee, EmployeeStatus } from "@/api/admin-employees-api";

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

    const input: LoadAdminEmployeesInput = {
      page: currentPage,
      limit: PAGE_SIZE,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    };

    const result = await loadAdminEmployees(input);

    if (result.data) {
      set({
        employees: result.data.employees,
        totalEmployees: result.data.total,
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
