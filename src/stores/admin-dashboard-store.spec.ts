import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminDashboardStore } from "./admin-dashboard-store";

const mockProfile = {
  id: 1,
  name: "Admin",
  email: "admin@test.com",
  role: "ADMIN_MASTER",
  status: "ACTIVE",
  createdAt: "2026-01-01",
};
const mockAgenda = {
  items: [
    {
      appointmentId: 1,
      clientName: "Client",
      serviceName: "Clean",
      startTime: "09:00",
      duration: 60,
      status: "CONFIRMED",
      date: "2026-03-15",
    },
  ],
  total: 1,
  page: 1,
  limit: 6,
};
const mockServices = [
  { id: 1, name: "Limpeza", isActive: true },
  { id: 2, name: "Inativo", isActive: false },
];

vi.mock("@/api/admin-dashboard-api", () => ({
  fetchAdminProfile: vi.fn(),
  fetchTodayAppointmentsCount: vi.fn(),
  fetchActiveClientsCount: vi.fn(),
  fetchPendingAppointmentsCount: vi.fn(),
  fetchTodayAgenda: vi.fn(),
  fetchServices: vi.fn(),
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
  resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminDashboard: { loadError: "Failed to load dashboard" } },
}));

const api = await import("@/api/admin-dashboard-api");
const { HttpClientError } = await import("@/api/http-client");

function resetStore() {
  useAdminDashboardStore.getState().reset();
}

describe("AdminDashboardStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("loadDashboard", () => {
    it("should load all dashboard data on success", async () => {
      vi.mocked(api.fetchAdminProfile).mockResolvedValue(mockProfile);
      vi.mocked(api.fetchTodayAppointmentsCount).mockResolvedValue({ count: 5 });
      vi.mocked(api.fetchActiveClientsCount).mockResolvedValue({ count: 10 });
      vi.mocked(api.fetchPendingAppointmentsCount).mockResolvedValue({ count: 3 });
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue(mockAgenda);
      vi.mocked(api.fetchServices).mockResolvedValue(
        mockServices.filter((s) => s.isActive).map((s) => ({ id: s.id, name: s.name })),
      );

      await useAdminDashboardStore.getState().loadDashboard();

      const state = useAdminDashboardStore.getState();
      expect(state.profile).toEqual(mockProfile);
      expect(state.todayAppointmentsCount).toBe(5);
      expect(state.activeClientsCount).toBe(10);
      expect(state.pendingServicesCount).toBe(3);
      expect(state.agendaItems).toEqual(mockAgenda.items);
      expect(state.serviceOptions).toEqual([{ id: 1, name: "Limpeza" }]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set isAuthError when profile fetch returns 401", async () => {
      vi.mocked(api.fetchAdminProfile).mockRejectedValue(new HttpClientError(401, "Unauthorized"));
      vi.mocked(api.fetchTodayAppointmentsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchActiveClientsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchPendingAppointmentsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });
      vi.mocked(api.fetchServices).mockResolvedValue([]);

      await useAdminDashboardStore.getState().loadDashboard();

      const state = useAdminDashboardStore.getState();
      expect(state.isAuthError).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Failed to load dashboard");
    });

    it("should handle partial failures gracefully", async () => {
      vi.mocked(api.fetchAdminProfile).mockResolvedValue(mockProfile);
      vi.mocked(api.fetchTodayAppointmentsCount).mockRejectedValue(new Error("network"));
      vi.mocked(api.fetchActiveClientsCount).mockResolvedValue({ count: 10 });
      vi.mocked(api.fetchPendingAppointmentsCount).mockRejectedValue(new Error("timeout"));
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue(mockAgenda);
      vi.mocked(api.fetchServices).mockRejectedValue(new Error("500"));

      await useAdminDashboardStore.getState().loadDashboard();

      const state = useAdminDashboardStore.getState();
      expect(state.profile).toEqual(mockProfile);
      expect(state.todayAppointmentsCount).toBe(0);
      expect(state.activeClientsCount).toBe(10);
      expect(state.pendingServicesCount).toBe(0);
      expect(state.agendaItems).toEqual(mockAgenda.items);
      expect(state.serviceOptions).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should skip reload when data is already loaded", async () => {
      vi.mocked(api.fetchAdminProfile).mockResolvedValue(mockProfile);
      vi.mocked(api.fetchTodayAppointmentsCount).mockResolvedValue({ count: 5 });
      vi.mocked(api.fetchActiveClientsCount).mockResolvedValue({ count: 10 });
      vi.mocked(api.fetchPendingAppointmentsCount).mockResolvedValue({ count: 3 });
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue(mockAgenda);
      vi.mocked(api.fetchServices).mockResolvedValue([]);

      await useAdminDashboardStore.getState().loadDashboard();
      vi.clearAllMocks();

      await useAdminDashboardStore.getState().loadDashboard();

      expect(api.fetchAdminProfile).not.toHaveBeenCalled();
    });
  });

  describe("loadDashboard — 403 on profile", () => {
    it("should set isAuthError on 403", async () => {
      vi.mocked(api.fetchAdminProfile).mockRejectedValue(new HttpClientError(403, "Forbidden"));
      vi.mocked(api.fetchTodayAppointmentsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchActiveClientsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchPendingAppointmentsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });
      vi.mocked(api.fetchServices).mockResolvedValue([]);

      await useAdminDashboardStore.getState().loadDashboard();

      expect(useAdminDashboardStore.getState().isAuthError).toBe(true);
    });
  });

  describe("loadDashboard — non-auth profile error", () => {
    it("should set error but not isAuthError on 500", async () => {
      vi.mocked(api.fetchAdminProfile).mockRejectedValue(new HttpClientError(500, "Server error"));
      vi.mocked(api.fetchTodayAppointmentsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchActiveClientsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchPendingAppointmentsCount).mockResolvedValue({ count: 0 });
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });
      vi.mocked(api.fetchServices).mockResolvedValue([]);

      await useAdminDashboardStore.getState().loadDashboard();

      const state = useAdminDashboardStore.getState();
      expect(state.isAuthError).toBe(false);
      expect(state.error).toBe("Failed to load dashboard");
    });
  });

  describe("loadAgenda", () => {
    it("should load agenda items", async () => {
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue(mockAgenda);

      await useAdminDashboardStore.getState().loadAgenda(1);

      const state = useAdminDashboardStore.getState();
      expect(state.agendaItems).toEqual(mockAgenda.items);
      expect(state.agendaTotal).toBe(1);
      expect(state.agendaPage).toBe(1);
      expect(state.isAgendaLoading).toBe(false);
    });

    it("should set isAuthError on 401", async () => {
      vi.mocked(api.fetchTodayAgenda).mockRejectedValue(new HttpClientError(401, "Unauthorized"));

      await useAdminDashboardStore.getState().loadAgenda(1);

      expect(useAdminDashboardStore.getState().isAuthError).toBe(true);
    });

    it("should set isAuthError on 403", async () => {
      vi.mocked(api.fetchTodayAgenda).mockRejectedValue(new HttpClientError(403, "Forbidden"));

      await useAdminDashboardStore.getState().loadAgenda(1);

      expect(useAdminDashboardStore.getState().isAuthError).toBe(true);
    });

    it("should pass serviceId to fetchTodayAgenda", async () => {
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });

      await useAdminDashboardStore.getState().loadAgenda(2, 5);

      expect(api.fetchTodayAgenda).toHaveBeenCalledWith(2, 6, 5, expect.any(AbortSignal));
    });

    it("should not update state on non-auth error", async () => {
      useAdminDashboardStore.setState({ agendaItems: mockAgenda.items });
      vi.mocked(api.fetchTodayAgenda).mockRejectedValue(new Error("network"));

      await useAdminDashboardStore.getState().loadAgenda(1);

      const state = useAdminDashboardStore.getState();
      expect(state.isAgendaLoading).toBe(false);
      expect(state.isAuthError).toBe(false);
    });
  });

  describe("setAgendaPage", () => {
    it("should call loadAgenda with correct page and service filter", async () => {
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue({ items: [], total: 0, page: 3, limit: 6 });
      useAdminDashboardStore.setState({ agendaServiceFilter: "5" });

      useAdminDashboardStore.getState().setAgendaPage(3);

      expect(api.fetchTodayAgenda).toHaveBeenCalledWith(3, 6, 5, expect.any(AbortSignal));
    });

    it("should pass undefined serviceId for 'all' filter", async () => {
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });
      useAdminDashboardStore.setState({ agendaServiceFilter: "all" });

      useAdminDashboardStore.getState().setAgendaPage(1);

      expect(api.fetchTodayAgenda).toHaveBeenCalledWith(1, 6, undefined, expect.any(AbortSignal));
    });
  });

  describe("setAgendaServiceFilter", () => {
    it("should clear items and set loading on filter change", () => {
      useAdminDashboardStore.setState({ agendaItems: mockAgenda.items });
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue({ items: [], total: 0, page: 1, limit: 6 });

      useAdminDashboardStore.getState().setAgendaServiceFilter("1");

      const state = useAdminDashboardStore.getState();
      expect(state.agendaServiceFilter).toBe("1");
      expect(state.agendaPage).toBe(1);
      expect(state.isAgendaLoading).toBe(true);
      expect(state.agendaItems).toEqual([]);
    });
  });

  describe("reset", () => {
    it("should restore initial state", async () => {
      vi.mocked(api.fetchAdminProfile).mockResolvedValue(mockProfile);
      vi.mocked(api.fetchTodayAppointmentsCount).mockResolvedValue({ count: 5 });
      vi.mocked(api.fetchActiveClientsCount).mockResolvedValue({ count: 10 });
      vi.mocked(api.fetchPendingAppointmentsCount).mockResolvedValue({ count: 3 });
      vi.mocked(api.fetchTodayAgenda).mockResolvedValue(mockAgenda);
      vi.mocked(api.fetchServices).mockResolvedValue([]);

      await useAdminDashboardStore.getState().loadDashboard();
      useAdminDashboardStore.getState().reset();

      const state = useAdminDashboardStore.getState();
      expect(state.profile).toBeNull();
      expect(state.todayAppointmentsCount).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthError).toBe(false);
    });
  });
});
