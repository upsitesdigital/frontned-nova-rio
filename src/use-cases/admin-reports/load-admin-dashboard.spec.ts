import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin/admin-dashboard-api", () => ({
  AdminDashboardApi: {
    fetchTodayAppointmentsCount: vi.fn(),
    fetchActiveClientsCount: vi.fn(),
    fetchPendingAppointmentsCount: vi.fn(),
    fetchTodayAgenda: vi.fn(),
  },
}));

vi.mock("@/api/core/auth-api", () => ({
  AuthApi: { fetchAdminProfile: vi.fn() },
}));

vi.mock("@/use-cases/admin-services/get-active-service-options", () => ({
  GetActiveServiceOptions: {
    getActiveServiceOptions: vi.fn(),
  },
}));

vi.mock("@/api/core/http-client", () => ({
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

vi.mock("@/lib/auth/auth-helpers", () => ({
  AuthHelpers: {
    isAuthError: (error: unknown) =>
      error instanceof Error &&
      "status" in error &&
      ((error as { status: number }).status === 401 ||
        (error as { status: number }).status === 403),
    resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
  },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: { adminDashboard: { loadError: "Dashboard error" } },
}));

const dashboardApi = await import("@/api/admin/admin-dashboard-api");
const authApi = await import("@/api/core/auth-api");
const serviceOptions = await import("@/use-cases/admin-services/get-active-service-options");
const { HttpClientError } = await import("@/api/core/http-client");
const { LoadAdminDashboard } = await import("./load-admin-dashboard");

const mockProfile = { id: 1, name: "Admin", email: "admin@test.com" };

describe("loadAdminDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authApi.AuthApi.fetchAdminProfile).mockResolvedValue(mockProfile as never);
    vi.mocked(dashboardApi.AdminDashboardApi.fetchTodayAppointmentsCount).mockResolvedValue({
      count: 5,
    });
    vi.mocked(dashboardApi.AdminDashboardApi.fetchActiveClientsCount).mockResolvedValue({
      count: 10,
    });
    vi.mocked(dashboardApi.AdminDashboardApi.fetchPendingAppointmentsCount).mockResolvedValue({
      count: 3,
    });
    vi.mocked(dashboardApi.AdminDashboardApi.fetchTodayAgenda).mockResolvedValue({
      items: [{ appointmentId: 1 }] as never[],
      total: 1,
      page: 1,
      limit: 6,
    });
    vi.mocked(serviceOptions.GetActiveServiceOptions.getActiveServiceOptions).mockResolvedValue({
      data: [{ id: 1, name: "Limpeza" }],
      error: null,
    });
  });

  it("should return full dashboard data on success", async () => {
    const result = await LoadAdminDashboard.loadAdminDashboardData(6);

    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
    expect(result.data).toEqual({
      profile: mockProfile,
      todayAppointmentsCount: 5,
      activeClientsCount: 10,
      pendingServicesCount: 3,
      agendaItems: [{ appointmentId: 1 }],
      agendaTotal: 1,
      serviceOptions: [{ id: 1, name: "Limpeza" }],
    });
  });

  it("should return error when profile fetch fails", async () => {
    vi.mocked(authApi.AuthApi.fetchAdminProfile).mockRejectedValue(
      new HttpClientError(401, "Unauthorized"),
    );

    const result = await LoadAdminDashboard.loadAdminDashboardData(6);

    expect(result.data).toBeNull();
    expect(result.isAuthError).toBe(true);
    expect(result.error).toBe("Dashboard error");
  });

  it("should return data with zero counts when metric calls fail", async () => {
    vi.mocked(dashboardApi.AdminDashboardApi.fetchTodayAppointmentsCount).mockRejectedValue(
      new Error("fail"),
    );
    vi.mocked(dashboardApi.AdminDashboardApi.fetchActiveClientsCount).mockRejectedValue(
      new Error("fail"),
    );
    vi.mocked(dashboardApi.AdminDashboardApi.fetchPendingAppointmentsCount).mockRejectedValue(
      new Error("fail"),
    );

    const result = await LoadAdminDashboard.loadAdminDashboardData(6);

    expect(result.data).not.toBeNull();
    expect(result.data?.todayAppointmentsCount).toBe(0);
    expect(result.data?.activeClientsCount).toBe(0);
    expect(result.data?.pendingServicesCount).toBe(0);
  });

  it("should return empty agenda when agenda fetch fails", async () => {
    vi.mocked(dashboardApi.AdminDashboardApi.fetchTodayAgenda).mockRejectedValue(new Error("fail"));

    const result = await LoadAdminDashboard.loadAdminDashboardData(6);

    expect(result.data?.agendaItems).toEqual([]);
    expect(result.data?.agendaTotal).toBe(0);
  });

  it("should return empty service options when service fetch fails", async () => {
    vi.mocked(serviceOptions.GetActiveServiceOptions.getActiveServiceOptions).mockRejectedValue(
      new Error("fail"),
    );

    const result = await LoadAdminDashboard.loadAdminDashboardData(6);

    expect(result.data?.serviceOptions).toEqual([]);
  });

  it("should pass agendaPageSize to fetchTodayAgenda", async () => {
    await LoadAdminDashboard.loadAdminDashboardData(10);

    expect(dashboardApi.AdminDashboardApi.fetchTodayAgenda).toHaveBeenCalledWith(1, 10);
  });
});
