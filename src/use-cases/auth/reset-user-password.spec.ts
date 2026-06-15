import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/auth-api", () => ({
  AuthApi: { resetPassword: vi.fn() },
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
  Messages: { password: { resetError: "Reset error" } },
}));

const api = await import("@/api/core/auth-api");
const { ResetUserPassword } = await import("./reset-user-password");

describe("resetUserPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API call succeeds", async () => {
    vi.mocked(api.AuthApi.resetPassword).mockResolvedValue({ message: "ok" });

    const result = await ResetUserPassword.resetUserPassword(
      "user@example.com",
      "123456",
      "NewPass@1",
    );

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should call resetPassword with correct parameters", async () => {
    vi.mocked(api.AuthApi.resetPassword).mockResolvedValue({ message: "ok" });

    await ResetUserPassword.resetUserPassword("a@b.com", "CODE1", "Str0ng!Pass");

    expect(api.AuthApi.resetPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      code: "CODE1",
      newPassword: "Str0ng!Pass",
    });
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.AuthApi.resetPassword).mockRejectedValue(new Error("Server down"));

    const result = await ResetUserPassword.resetUserPassword(
      "user@example.com",
      "123456",
      "NewPass@1",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Reset error");
  });

  it("should call API exactly once", async () => {
    vi.mocked(api.AuthApi.resetPassword).mockResolvedValue({ message: "ok" });

    await ResetUserPassword.resetUserPassword("x@y.com", "000", "Pass@1234");

    expect(api.AuthApi.resetPassword).toHaveBeenCalledTimes(1);
  });
});
