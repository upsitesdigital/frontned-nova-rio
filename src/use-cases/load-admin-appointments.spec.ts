import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-appointments-api", () => ({
  fetchAdminAppointments: vi.fn(),
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

vi.mock("@/lib/date-helpers", () => ({
  buildTodayDate: () => "2026-03-16",
  buildWeekRange: () => ({ weekStart: "2026-03-16", weekEnd: "2026-03-22" }),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminAppointments: { loadError: "Load error" } },
}));

const api = await import("@/api/admin-appointments-api");
const { HttpClientError } = await import("@/api/http-client");
const { loadAdminAppointments } = await import("./load-admin-appointments");

describe("loadAdminAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return appointments on success", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [{ id: 1 }] as never,
      total: 1,
      page: 1,
      limit: 10,
    });

    const result = await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "today",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "all",
    });

    expect(result.data).toEqual({ appointments: [{ id: 1 }], total: 1, page: 1 });
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });

  it("should pass date param for today viewMode", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "today",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "all",
    });

    const params = vi.mocked(api.fetchAdminAppointments).mock.calls[0][0];
    expect(params.date).toBe("2026-03-16");
    expect(params.weekStart).toBeUndefined();
  });

  it("should pass weekStart/weekEnd for week viewMode", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "week",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "all",
    });

    const params = vi.mocked(api.fetchAdminAppointments).mock.calls[0][0];
    expect(params.weekStart).toBe("2026-03-16");
    expect(params.weekEnd).toBe("2026-03-22");
    expect(params.date).toBeUndefined();
  });

  it("should pass employeeId for employee viewMode with filter", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "employee",
      statusFilter: "all",
      employeeFilter: "5",
      unitFilter: "all",
    });

    const params = vi.mocked(api.fetchAdminAppointments).mock.calls[0][0];
    expect(params.employeeId).toBe(5);
  });

  it("should not pass employeeId when filter is all", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "employee",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "all",
    });

    const params = vi.mocked(api.fetchAdminAppointments).mock.calls[0][0];
    expect(params.employeeId).toBeUndefined();
  });

  it("should pass unitId for unit viewMode with filter", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "unit",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "3",
    });

    const params = vi.mocked(api.fetchAdminAppointments).mock.calls[0][0];
    expect(params.unitId).toBe(3);
  });

  it("should pass status filter when not all", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "today",
      statusFilter: "SCHEDULED",
      employeeFilter: "all",
      unitFilter: "all",
    });

    const params = vi.mocked(api.fetchAdminAppointments).mock.calls[0][0];
    expect(params.status).toBe("SCHEDULED");
  });

  it("should not pass status when filter is all", async () => {
    vi.mocked(api.fetchAdminAppointments).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "today",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "all",
    });

    const params = vi.mocked(api.fetchAdminAppointments).mock.calls[0][0];
    expect(params.status).toBeUndefined();
  });

  it("should return isAuthError on 401", async () => {
    vi.mocked(api.fetchAdminAppointments).mockRejectedValue(
      new HttpClientError(401, "Unauthorized"),
    );

    const result = await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "today",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "all",
    });

    expect(result.data).toBeNull();
    expect(result.isAuthError).toBe(true);
    expect(result.error).toBe("Load error");
  });

  it("should return error without isAuthError on 500", async () => {
    vi.mocked(api.fetchAdminAppointments).mockRejectedValue(
      new HttpClientError(500, "Server error"),
    );

    const result = await loadAdminAppointments({
      page: 1,
      pageSize: 10,
      viewMode: "today",
      statusFilter: "all",
      employeeFilter: "all",
      unitFilter: "all",
    });

    expect(result.data).toBeNull();
    expect(result.isAuthError).toBe(false);
    expect(result.error).toBe("Load error");
  });

  it("should return null data with no error when aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    vi.mocked(api.fetchAdminAppointments).mockRejectedValue(new DOMException("Aborted"));

    const result = await loadAdminAppointments(
      {
        page: 1,
        pageSize: 10,
        viewMode: "today",
        statusFilter: "all",
        employeeFilter: "all",
        unitFilter: "all",
      },
      controller.signal,
    );

    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });
});
