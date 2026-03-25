import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-clients-api", () => ({
  rejectAdminClient: vi.fn(),
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
  MESSAGES: { adminClients: { rejectError: "Reject error" } },
}));

const api = await import("@/api/admin-clients-api");
const { rejectAdminClient } = await import("./reject-admin-client");

describe("rejectAdminClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when rejection succeeds", async () => {
    vi.mocked(api.rejectAdminClient).mockResolvedValue(undefined);

    const result = await rejectAdminClient("42");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });

  it("should call API with correct client id", async () => {
    vi.mocked(api.rejectAdminClient).mockResolvedValue(undefined);

    await rejectAdminClient("99");

    expect(api.rejectAdminClient).toHaveBeenCalledWith("99");
    expect(api.rejectAdminClient).toHaveBeenCalledTimes(1);
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.rejectAdminClient).mockRejectedValue(new Error("Server error"));

    const result = await rejectAdminClient("42");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Reject error");
  });

  it("should detect auth error on 403", async () => {
    const authError = Object.assign(new Error("Forbidden"), { status: 403 });
    vi.mocked(api.rejectAdminClient).mockRejectedValue(authError);

    const result = await rejectAdminClient("42");

    expect(result.success).toBe(false);
    expect(result.isAuthError).toBe(true);
  });
});
