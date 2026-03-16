import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-dashboard-api", () => ({
  fetchTodayAppointmentsCount: vi.fn(),
  fetchActiveClientsCount: vi.fn(),
  fetchPendingAppointmentsCount: vi.fn(),
  fetchTodayAgenda: vi.fn(),
}));

vi.mock("@/api/auth-api", () => ({
  fetchAdminProfile: vi.fn(),
}));

vi.mock("./get-active-service-options", () => ({
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
  MESSAGES: { adminDashboard: { loadError: "Dashboard error" } },
}));

const dashboardApi = await import("@/api/admin-dashboard-api");
const authApi = await import("@/api/auth-api");
const serviceOptions = await import("./get-active-service-options");
const { HttpClientError } = await import("@/api/http-client");
const { loadAdminDashboardData } = await import("./load-admin-dashboard");

const mockProfile = { id: 1, name: "Admin", email: "admin@test.com" };

describe("loadAdminDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authApi.fetchAdminProfile).mockResolvedValue(mockProfile as never);
    vi.mocked(dashboardApi.fetchTodayAppointmentsCount).mockResolvedValue({ count: 5 });
    vi.mocked(dashboardApi.fetchActiveClientsCount).mockResolvedValue({ count: 10 });
    vi.mocked(dashboardApi.fetchPendingAppointmentsCount).mockResolvedValue({ count: 3 });
    vi.mocked(dashboardApi.fetchTodayAgenda).mockResolvedValue({
      items: [{ appointmentId: 1 }] as never[],
      total: 1,
      page: 1,
      limit: 6,
    });
    vi.mocked(serviceOptions.getActiveServiceOptions).mockResolvedValue({
      data: [{ id: 1, name: "Limpeza" }],
      error: null,
    });
  });

  it("should return full dashboard data on success", async () => {
    const result = await loadAdminDashboardData(6);

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
    vi.mocked(authApi.fetchAdminProfile).mockRejectedValue(
      new HttpClientError(401, "Unauthorized"),
    );

    const result = await loadAdminDashboardData(6);

    expect(result.data).toBeNull();
    expect(result.isAuthError).toBe(true);
    expect(result.error).toBe("Dashboard error");
  });

  it("should return data with zero counts when metric calls fail", async () => {
    vi.mocked(dashboardApi.fetchTodayAppointmentsCount).mockRejectedValue(new Error("fail"));
    vi.mocked(dashboardApi.fetchActiveClientsCount).mockRejectedValue(new Error("fail"));
    vi.mocked(dashboardApi.fetchPendingAppointmentsCount).mockRejectedValue(new Error("fail"));

    const result = await loadAdminDashboardData(6);

    expect(result.data).not.toBeNull();
    expect(result.data?.todayAppointmentsCount).toBe(0);
    expect(result.data?.activeClientsCount).toBe(0);
    expect(result.data?.pendingServicesCount).toBe(0);
  });

  it("should return empty agenda when agenda fetch fails", async () => {
    vi.mocked(dashboardApi.fetchTodayAgenda).mockRejectedValue(new Error("fail"));

    const result = await loadAdminDashboardData(6);

    expect(result.data?.agendaItems).toEqual([]);
    expect(result.data?.agendaTotal).toBe(0);
  });

  it("should return empty service options when service fetch fails", async () => {
    vi.mocked(serviceOptions.getActiveServiceOptions).mockRejectedValue(new Error("fail"));

    const result = await loadAdminDashboardData(6);

    expect(result.data?.serviceOptions).toEqual([]);
  });

  it("should pass agendaPageSize to fetchTodayAgenda", async () => {
    await loadAdminDashboardData(10);

    expect(dashboardApi.fetchTodayAgenda).toHaveBeenCalledWith(1, 10);
  });
});
