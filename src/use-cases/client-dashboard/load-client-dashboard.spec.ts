import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/client/dashboard-api", () => ({
  DashboardApi: { fetchClientDashboardSummary: vi.fn() },
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
  Messages: {
    dashboard: { loadError: "Dashboard load error" },
  },
}));

const api = await import("@/api/client/dashboard-api");
const { HttpClientError } = await import("@/api/core/http-client");
const { LoadClientDashboard } = await import("./load-client-dashboard");

const fakeDashboard = {
  clientName: "John",
  nextAppointment: null,
  appointmentsCount: 3,
  appointmentsCountLabel: "3 agendamentos",
  serviceHistory: [],
};

describe("loadClientDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return data with no error on success", async () => {
      vi.mocked(api.DashboardApi.fetchClientDashboardSummary).mockResolvedValue(fakeDashboard);

      const result = await LoadClientDashboard.loadClientDashboard();

      expect(result).toEqual({
        data: fakeDashboard,
        error: null,
        isAuthError: false,
      });
    });
  });

  describe("error handling", () => {
    it("should return auth error when status is 401", async () => {
      vi.mocked(api.DashboardApi.fetchClientDashboardSummary).mockRejectedValue(
        new HttpClientError(401, "Unauthorized"),
      );

      const result = await LoadClientDashboard.loadClientDashboard();

      expect(result).toEqual({
        data: null,
        error: "Dashboard load error",
        isAuthError: true,
      });
    });

    it("should return auth error when status is 403", async () => {
      vi.mocked(api.DashboardApi.fetchClientDashboardSummary).mockRejectedValue(
        new HttpClientError(403, "Forbidden"),
      );

      const result = await LoadClientDashboard.loadClientDashboard();

      expect(result).toEqual({
        data: null,
        error: "Dashboard load error",
        isAuthError: true,
      });
    });

    it("should return non-auth error for other failures", async () => {
      vi.mocked(api.DashboardApi.fetchClientDashboardSummary).mockRejectedValue(
        new HttpClientError(500, "Server error"),
      );

      const result = await LoadClientDashboard.loadClientDashboard();

      expect(result).toEqual({
        data: null,
        error: "Dashboard load error",
        isAuthError: false,
      });
    });

    it("should return non-auth error for generic errors", async () => {
      vi.mocked(api.DashboardApi.fetchClientDashboardSummary).mockRejectedValue(
        new Error("Network"),
      );

      const result = await LoadClientDashboard.loadClientDashboard();

      expect(result).toEqual({
        data: null,
        error: "Dashboard load error",
        isAuthError: false,
      });
    });
  });
});
