import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin/admin-dashboard-api", () => ({
  AdminDashboardApi: { fetchTodayAgenda: vi.fn() },
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
  Messages: { agenda: { loadError: "Agenda error" } },
}));

const api = await import("@/api/admin/admin-dashboard-api");
const { HttpClientError } = await import("@/api/core/http-client");
const { LoadAdminAgenda } = await import("./load-admin-agenda");

describe("loadTodayAgenda", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return items and total on success", async () => {
    vi.mocked(api.AdminDashboardApi.fetchTodayAgenda).mockResolvedValue({
      items: [{ appointmentId: 1 }] as never[],
      total: 1,
      page: 1,
      limit: 6,
    });

    const result = await LoadAdminAgenda.loadTodayAgenda(1, 6);

    expect(result.items).toEqual([{ appointmentId: 1 }]);
    expect(result.total).toBe(1);
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });

  it("should pass page, pageSize, serviceId and signal to API", async () => {
    vi.mocked(api.AdminDashboardApi.fetchTodayAgenda).mockResolvedValue({
      items: [],
      total: 0,
      page: 2,
      limit: 6,
    });

    const controller = new AbortController();
    await LoadAdminAgenda.loadTodayAgenda(2, 6, 5, controller.signal);

    expect(api.AdminDashboardApi.fetchTodayAgenda).toHaveBeenCalledWith(2, 6, 5, controller.signal);
  });

  it("should return auth error on 401", async () => {
    vi.mocked(api.AdminDashboardApi.fetchTodayAgenda).mockRejectedValue(
      new HttpClientError(401, "Unauthorized"),
    );

    const result = await LoadAdminAgenda.loadTodayAgenda(1, 6);

    expect(result.items).toBeNull();
    expect(result.isAuthError).toBe(true);
    expect(result.error).toBe("Agenda error");
  });

  it("should return generic error on 500", async () => {
    vi.mocked(api.AdminDashboardApi.fetchTodayAgenda).mockRejectedValue(
      new HttpClientError(500, "Server error"),
    );

    const result = await LoadAdminAgenda.loadTodayAgenda(1, 6);

    expect(result.items).toBeNull();
    expect(result.isAuthError).toBe(false);
    expect(result.error).toBe("Agenda error");
  });

  it("should return null items with no error when aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    vi.mocked(api.AdminDashboardApi.fetchTodayAgenda).mockRejectedValue(
      new DOMException("Aborted"),
    );

    const result = await LoadAdminAgenda.loadTodayAgenda(1, 6, undefined, controller.signal);

    expect(result.items).toBeNull();
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });
});
