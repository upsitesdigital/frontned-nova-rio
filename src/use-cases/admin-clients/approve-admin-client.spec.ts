import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin/admin-clients-api", () => ({
  AdminClientsApi: { approveAdminClient: vi.fn() },
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
  Messages: { adminClients: { approveError: "Approve error" } },
}));

const api = await import("@/api/admin/admin-clients-api");
const { ApproveAdminClient } = await import("./approve-admin-client");

describe("approveAdminClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when approval succeeds", async () => {
    vi.mocked(api.AdminClientsApi.approveAdminClient).mockResolvedValue(undefined);

    const result = await ApproveAdminClient.approveAdminClient("42");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });

  it("should call API with correct client id", async () => {
    vi.mocked(api.AdminClientsApi.approveAdminClient).mockResolvedValue(undefined);

    await ApproveAdminClient.approveAdminClient("99");

    expect(api.AdminClientsApi.approveAdminClient).toHaveBeenCalledWith("99");
    expect(api.AdminClientsApi.approveAdminClient).toHaveBeenCalledTimes(1);
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.AdminClientsApi.approveAdminClient).mockRejectedValue(new Error("Server error"));

    const result = await ApproveAdminClient.approveAdminClient("42");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Approve error");
  });

  it("should detect auth error on 401", async () => {
    const authError = Object.assign(new Error("Unauthorized"), { status: 401 });
    vi.mocked(api.AdminClientsApi.approveAdminClient).mockRejectedValue(authError);

    const result = await ApproveAdminClient.approveAdminClient("42");

    expect(result.success).toBe(false);
    expect(result.isAuthError).toBe(true);
  });
});
