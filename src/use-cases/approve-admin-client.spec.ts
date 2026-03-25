import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-clients-api", () => ({
  approveAdminClient: vi.fn(),
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
  MESSAGES: { adminClients: { approveError: "Approve error" } },
}));

const api = await import("@/api/admin-clients-api");
const { approveAdminClient } = await import("./approve-admin-client");

describe("approveAdminClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when approval succeeds", async () => {
    vi.mocked(api.approveAdminClient).mockResolvedValue(undefined);

    const result = await approveAdminClient("42");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });

  it("should call API with correct client id", async () => {
    vi.mocked(api.approveAdminClient).mockResolvedValue(undefined);

    await approveAdminClient("99");

    expect(api.approveAdminClient).toHaveBeenCalledWith("99");
    expect(api.approveAdminClient).toHaveBeenCalledTimes(1);
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.approveAdminClient).mockRejectedValue(new Error("Server error"));

    const result = await approveAdminClient("42");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Approve error");
  });

  it("should detect auth error on 401", async () => {
    const authError = Object.assign(new Error("Unauthorized"), { status: 401 });
    vi.mocked(api.approveAdminClient).mockRejectedValue(authError);

    const result = await approveAdminClient("42");

    expect(result.success).toBe(false);
    expect(result.isAuthError).toBe(true);
  });
});
