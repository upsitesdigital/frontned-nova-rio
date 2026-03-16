import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/auth-api", () => ({
  resetPassword: vi.fn(),
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
  MESSAGES: { password: { resetError: "Reset error" } },
}));

const api = await import("@/api/auth-api");
const { resetUserPassword } = await import("./reset-user-password");

describe("resetUserPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API call succeeds", async () => {
    vi.mocked(api.resetPassword).mockResolvedValue({ message: "ok" });

    const result = await resetUserPassword("user@example.com", "123456", "NewPass@1");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should call resetPassword with correct parameters", async () => {
    vi.mocked(api.resetPassword).mockResolvedValue({ message: "ok" });

    await resetUserPassword("a@b.com", "CODE1", "Str0ng!Pass");

    expect(api.resetPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      code: "CODE1",
      newPassword: "Str0ng!Pass",
    });
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.resetPassword).mockRejectedValue(new Error("Server down"));

    const result = await resetUserPassword("user@example.com", "123456", "NewPass@1");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Reset error");
  });

  it("should call API exactly once", async () => {
    vi.mocked(api.resetPassword).mockResolvedValue({ message: "ok" });

    await resetUserPassword("x@y.com", "000", "Pass@1234");

    expect(api.resetPassword).toHaveBeenCalledTimes(1);
  });
});
