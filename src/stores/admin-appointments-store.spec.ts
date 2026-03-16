import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminAppointmentsStore } from "./admin-appointments-store";

const mockAppointment = {
  id: 1,
  uuid: "uuid-1",
  date: "2026-03-15T00:00:00.000Z",
  startTime: "16:00",
  duration: 50,
  status: "COMPLETED" as const,
  recurrenceType: "SINGLE" as const,
  locationZip: null,
  locationAddress: null,
  notes: null,
  createdAt: "2026-03-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
  client: { id: 1, name: "João Silva", email: "joao@test.com" },
  service: { id: 1, name: "Faxina Pós-Obra" },
  employee: { id: 1, name: "Carlos Magno" },
  package: null,
  unit: null,
};

vi.mock("@/use-cases/load-admin-appointments", () => ({
  loadAdminAppointments: vi.fn(),
}));

vi.mock("@/use-cases/get-active-employee-options", () => ({
  getActiveEmployeeOptions: vi.fn(),
}));

vi.mock("@/use-cases/get-active-unit-options", () => ({
  getActiveUnitOptions: vi.fn(),
}));

vi.mock("@/use-cases/get-active-service-options", () => ({
  getActiveServiceOptions: vi.fn(),
}));

const loadAppointmentsUseCase = await import("@/use-cases/load-admin-appointments");
const employeeOptionsUseCase = await import("@/use-cases/get-active-employee-options");
const unitOptionsUseCase = await import("@/use-cases/get-active-unit-options");
const serviceOptionsUseCase = await import("@/use-cases/get-active-service-options");

function resetStore() {
  useAdminAppointmentsStore.getState().reset();
}

describe("AdminAppointmentsStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("loadAppointments", () => {
    it("should load appointments successfully", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [mockAppointment], total: 1, page: 1 },
        error: null,
        isAuthError: false,
      });

      await useAdminAppointmentsStore.getState().loadAppointments();

      const state = useAdminAppointmentsStore.getState();
      expect(state.appointments).toEqual([mockAppointment]);
      expect(state.total).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should pass correct input to use case with today viewMode", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 1 },
        error: null,
        isAuthError: false,
      });

      await useAdminAppointmentsStore.getState().loadAppointments();

      const input = vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mock.calls[0][0];
      expect(input.viewMode).toBe("today");
      expect(input.page).toBe(1);
      expect(input.pageSize).toBe(10);
    });

    it("should pass week viewMode to use case", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 1 },
        error: null,
        isAuthError: false,
      });

      useAdminAppointmentsStore.setState({ viewMode: "week" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const input = vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mock.calls[0][0];
      expect(input.viewMode).toBe("week");
    });

    it("should pass employee filter to use case", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 1 },
        error: null,
        isAuthError: false,
      });

      useAdminAppointmentsStore.setState({ viewMode: "employee", employeeFilter: "5" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const input = vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mock.calls[0][0];
      expect(input.employeeFilter).toBe("5");
    });

    it("should pass unit filter to use case", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 1 },
        error: null,
        isAuthError: false,
      });

      useAdminAppointmentsStore.setState({ viewMode: "unit", unitFilter: "3" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const input = vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mock.calls[0][0];
      expect(input.unitFilter).toBe("3");
    });

    it("should pass status filter to use case", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 1 },
        error: null,
        isAuthError: false,
      });

      useAdminAppointmentsStore.setState({ statusFilter: "SCHEDULED" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const input = vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mock.calls[0][0];
      expect(input.statusFilter).toBe("SCHEDULED");
    });

    it("should set isAuthError when use case returns auth error", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: null,
        error: "Unauthorized",
        isAuthError: true,
      });

      await useAdminAppointmentsStore.getState().loadAppointments();

      const state = useAdminAppointmentsStore.getState();
      expect(state.isAuthError).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Unauthorized");
    });

    it("should set error but not isAuthError on generic error", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: null,
        error: "Failed to load appointments",
        isAuthError: false,
      });

      await useAdminAppointmentsStore.getState().loadAppointments();

      const state = useAdminAppointmentsStore.getState();
      expect(state.isAuthError).toBe(false);
      expect(state.error).toBe("Failed to load appointments");
    });
  });

  describe("loadFilterOptions", () => {
    it("should load all filter options", async () => {
      vi.mocked(employeeOptionsUseCase.getActiveEmployeeOptions).mockResolvedValue({
        data: [{ id: 1, name: "Carlos" }],
        error: null,
      });
      vi.mocked(unitOptionsUseCase.getActiveUnitOptions).mockResolvedValue({
        data: [{ id: 1, name: "Centro" }],
        error: null,
      });
      vi.mocked(serviceOptionsUseCase.getActiveServiceOptions).mockResolvedValue({
        data: [{ id: 1, name: "Limpeza" }],
        error: null,
      });

      await useAdminAppointmentsStore.getState().loadFilterOptions();

      const state = useAdminAppointmentsStore.getState();
      expect(state.employeeOptions).toEqual([{ id: 1, name: "Carlos" }]);
      expect(state.unitOptions).toEqual([{ id: 1, name: "Centro" }]);
      expect(state.serviceOptions).toEqual([{ id: 1, name: "Limpeza" }]);
      expect(state.isOptionsLoading).toBe(false);
    });

    it("should handle partial failures gracefully", async () => {
      vi.mocked(employeeOptionsUseCase.getActiveEmployeeOptions).mockRejectedValue(
        new Error("fail"),
      );
      vi.mocked(unitOptionsUseCase.getActiveUnitOptions).mockResolvedValue({
        data: [{ id: 1, name: "Centro" }],
        error: null,
      });
      vi.mocked(serviceOptionsUseCase.getActiveServiceOptions).mockRejectedValue(new Error("fail"));

      await useAdminAppointmentsStore.getState().loadFilterOptions();

      const state = useAdminAppointmentsStore.getState();
      expect(state.employeeOptions).toEqual([]);
      expect(state.unitOptions).toEqual([{ id: 1, name: "Centro" }]);
      expect(state.serviceOptions).toEqual([]);
    });
  });

  describe("setViewMode", () => {
    it("should reset page and filters when changing view mode", () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 1 },
        error: null,
        isAuthError: false,
      });

      useAdminAppointmentsStore.setState({ page: 3, employeeFilter: "5", unitFilter: "2" });
      useAdminAppointmentsStore.getState().setViewMode("week");

      const state = useAdminAppointmentsStore.getState();
      expect(state.viewMode).toBe("week");
      expect(state.page).toBe(1);
      expect(state.employeeFilter).toBe("all");
      expect(state.unitFilter).toBe("all");
    });
  });

  describe("setStatusFilter", () => {
    it("should update status filter and reset page", () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 1 },
        error: null,
        isAuthError: false,
      });

      useAdminAppointmentsStore.setState({ page: 5 });
      useAdminAppointmentsStore.getState().setStatusFilter("COMPLETED");

      const state = useAdminAppointmentsStore.getState();
      expect(state.statusFilter).toBe("COMPLETED");
      expect(state.page).toBe(1);
    });
  });

  describe("setPage", () => {
    it("should update page and reload", () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [], total: 0, page: 2 },
        error: null,
        isAuthError: false,
      });

      useAdminAppointmentsStore.getState().setPage(2);

      expect(loadAppointmentsUseCase.loadAdminAppointments).toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should restore initial state", async () => {
      vi.mocked(loadAppointmentsUseCase.loadAdminAppointments).mockResolvedValue({
        data: { appointments: [mockAppointment], total: 1, page: 1 },
        error: null,
        isAuthError: false,
      });
      await useAdminAppointmentsStore.getState().loadAppointments();

      useAdminAppointmentsStore.getState().reset();

      const state = useAdminAppointmentsStore.getState();
      expect(state.appointments).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.page).toBe(1);
      expect(state.viewMode).toBe("today");
      expect(state.statusFilter).toBe("all");
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
