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

const mockResponse = {
  data: [mockAppointment],
  total: 1,
  page: 1,
  limit: 10,
};

vi.mock("@/api/admin-appointments-api", () => ({
  fetchAdminAppointments: vi.fn(),
  fetchEmployeeOptions: vi.fn(),
  fetchUnitOptions: vi.fn(),
}));

vi.mock("@/use-cases/get-active-service-options", () => ({
  getActiveServiceOptions: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
  HttpClientError: class HttpClientError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpClientError";
    }
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  isAuthError: (error: unknown) =>
    error instanceof Error &&
    "status" in error &&
    ((error as { status: number }).status === 401 || (error as { status: number }).status === 403),
  resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminAppointments: { loadError: "Failed to load appointments" } },
}));

const appointmentsApi = await import("@/api/admin-appointments-api");
const serviceOptionsUseCase = await import("@/use-cases/get-active-service-options");
const { HttpClientError } = await import("@/api/http-client");

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
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue(mockResponse);

      await useAdminAppointmentsStore.getState().loadAppointments();

      const state = useAdminAppointmentsStore.getState();
      expect(state.appointments).toEqual([mockAppointment]);
      expect(state.total).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should pass date param when viewMode is today", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      await useAdminAppointmentsStore.getState().loadAppointments();

      const params = vi.mocked(appointmentsApi.fetchAdminAppointments).mock.calls[0][0];
      expect(params.date).toBeDefined();
      expect(params.weekStart).toBeUndefined();
    });

    it("should pass weekStart and weekEnd when viewMode is week", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      useAdminAppointmentsStore.setState({ viewMode: "week" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const params = vi.mocked(appointmentsApi.fetchAdminAppointments).mock.calls[0][0];
      expect(params.weekStart).toBeDefined();
      expect(params.weekEnd).toBeDefined();
      expect(params.date).toBeUndefined();
    });

    it("should pass employeeId when viewMode is employee and filter is set", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      useAdminAppointmentsStore.setState({ viewMode: "employee", employeeFilter: "5" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const params = vi.mocked(appointmentsApi.fetchAdminAppointments).mock.calls[0][0];
      expect(params.employeeId).toBe(5);
    });

    it("should pass unitId when viewMode is unit and filter is set", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      useAdminAppointmentsStore.setState({ viewMode: "unit", unitFilter: "3" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const params = vi.mocked(appointmentsApi.fetchAdminAppointments).mock.calls[0][0];
      expect(params.unitId).toBe(3);
    });

    it("should pass status filter when not 'all'", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      useAdminAppointmentsStore.setState({ statusFilter: "SCHEDULED" });
      await useAdminAppointmentsStore.getState().loadAppointments();

      const params = vi.mocked(appointmentsApi.fetchAdminAppointments).mock.calls[0][0];
      expect(params.status).toBe("SCHEDULED");
    });

    it("should not pass status when filter is 'all'", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      await useAdminAppointmentsStore.getState().loadAppointments();

      const params = vi.mocked(appointmentsApi.fetchAdminAppointments).mock.calls[0][0];
      expect(params.status).toBeUndefined();
    });

    it("should set isAuthError on 401", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockRejectedValue(
        new HttpClientError(401, "Unauthorized"),
      );

      await useAdminAppointmentsStore.getState().loadAppointments();

      const state = useAdminAppointmentsStore.getState();
      expect(state.isAuthError).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Failed to load appointments");
    });

    it("should set isAuthError on 403", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockRejectedValue(
        new HttpClientError(403, "Forbidden"),
      );

      await useAdminAppointmentsStore.getState().loadAppointments();

      expect(useAdminAppointmentsStore.getState().isAuthError).toBe(true);
    });

    it("should set error but not isAuthError on 500", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockRejectedValue(
        new HttpClientError(500, "Server error"),
      );

      await useAdminAppointmentsStore.getState().loadAppointments();

      const state = useAdminAppointmentsStore.getState();
      expect(state.isAuthError).toBe(false);
      expect(state.error).toBe("Failed to load appointments");
    });
  });

  describe("loadFilterOptions", () => {
    it("should load all filter options", async () => {
      vi.mocked(appointmentsApi.fetchEmployeeOptions).mockResolvedValue([
        { id: 1, name: "Carlos" },
      ]);
      vi.mocked(appointmentsApi.fetchUnitOptions).mockResolvedValue([{ id: 1, name: "Centro" }]);
      vi.mocked(serviceOptionsUseCase.getActiveServiceOptions).mockResolvedValue([
        { id: 1, name: "Limpeza" },
      ]);

      await useAdminAppointmentsStore.getState().loadFilterOptions();

      const state = useAdminAppointmentsStore.getState();
      expect(state.employeeOptions).toEqual([{ id: 1, name: "Carlos" }]);
      expect(state.unitOptions).toEqual([{ id: 1, name: "Centro" }]);
      expect(state.serviceOptions).toEqual([{ id: 1, name: "Limpeza" }]);
      expect(state.isOptionsLoading).toBe(false);
    });

    it("should handle partial failures gracefully", async () => {
      vi.mocked(appointmentsApi.fetchEmployeeOptions).mockRejectedValue(new Error("fail"));
      vi.mocked(appointmentsApi.fetchUnitOptions).mockResolvedValue([{ id: 1, name: "Centro" }]);
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
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
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
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
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
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 2,
        limit: 10,
      });

      useAdminAppointmentsStore.getState().setPage(2);

      expect(appointmentsApi.fetchAdminAppointments).toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should restore initial state", async () => {
      vi.mocked(appointmentsApi.fetchAdminAppointments).mockResolvedValue(mockResponse);
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
