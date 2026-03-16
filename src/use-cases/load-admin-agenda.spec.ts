import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-dashboard-api", () => ({
  fetchTodayAgenda: vi.fn(),
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
  MESSAGES: { agenda: { loadError: "Agenda error" } },
}));

const api = await import("@/api/admin-dashboard-api");
const { HttpClientError } = await import("@/api/http-client");
const { loadTodayAgenda } = await import("./load-admin-agenda");

describe("loadTodayAgenda", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return items and total on success", async () => {
    vi.mocked(api.fetchTodayAgenda).mockResolvedValue({
      items: [{ appointmentId: 1 }] as never[],
      total: 1,
      page: 1,
      limit: 6,
    });

    const result = await loadTodayAgenda(1, 6);

    expect(result.items).toEqual([{ appointmentId: 1 }]);
    expect(result.total).toBe(1);
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });

  it("should pass page, pageSize, serviceId and signal to API", async () => {
    vi.mocked(api.fetchTodayAgenda).mockResolvedValue({
      items: [],
      total: 0,
      page: 2,
      limit: 6,
    });

    const controller = new AbortController();
    await loadTodayAgenda(2, 6, 5, controller.signal);

    expect(api.fetchTodayAgenda).toHaveBeenCalledWith(2, 6, 5, controller.signal);
  });

  it("should return auth error on 401", async () => {
    vi.mocked(api.fetchTodayAgenda).mockRejectedValue(new HttpClientError(401, "Unauthorized"));

    const result = await loadTodayAgenda(1, 6);

    expect(result.items).toBeNull();
    expect(result.isAuthError).toBe(true);
    expect(result.error).toBe("Agenda error");
  });

  it("should return generic error on 500", async () => {
    vi.mocked(api.fetchTodayAgenda).mockRejectedValue(new HttpClientError(500, "Server error"));

    const result = await loadTodayAgenda(1, 6);

    expect(result.items).toBeNull();
    expect(result.isAuthError).toBe(false);
    expect(result.error).toBe("Agenda error");
  });

  it("should return null items with no error when aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    vi.mocked(api.fetchTodayAgenda).mockRejectedValue(new DOMException("Aborted"));

    const result = await loadTodayAgenda(1, 6, undefined, controller.signal);

    expect(result.items).toBeNull();
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });
});
