import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/auth-api", () => ({
  AuthApi: { requestPasswordReset: vi.fn() },
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
  Messages: { password: { resetSendError: "Send code error" } },
}));

const api = await import("@/api/core/auth-api");
const { RequestPasswordReset } = await import("./request-password-reset");

describe("requestPasswordResetCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API call succeeds", async () => {
    vi.mocked(api.AuthApi.requestPasswordReset).mockResolvedValue({ message: "ok" });

    const result = await RequestPasswordReset.requestPasswordResetCode("user@example.com");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should call requestPasswordReset with the correct email", async () => {
    vi.mocked(api.AuthApi.requestPasswordReset).mockResolvedValue({ message: "ok" });

    await RequestPasswordReset.requestPasswordResetCode("test@mail.com");

    expect(api.AuthApi.requestPasswordReset).toHaveBeenCalledWith({ email: "test@mail.com" });
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.AuthApi.requestPasswordReset).mockRejectedValue(new Error("Network error"));

    const result = await RequestPasswordReset.requestPasswordResetCode("user@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Send code error");
  });

  it("should call API exactly once per invocation", async () => {
    vi.mocked(api.AuthApi.requestPasswordReset).mockResolvedValue({ message: "ok" });

    await RequestPasswordReset.requestPasswordResetCode("a@b.com");

    expect(api.AuthApi.requestPasswordReset).toHaveBeenCalledTimes(1);
  });
});
