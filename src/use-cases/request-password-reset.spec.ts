import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/auth-api", () => ({
  requestPasswordReset: vi.fn(),
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
  MESSAGES: { password: { resetSendError: "Send code error" } },
}));

const api = await import("@/api/auth-api");
const { requestPasswordResetCode } = await import("./request-password-reset");

describe("requestPasswordResetCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API call succeeds", async () => {
    vi.mocked(api.requestPasswordReset).mockResolvedValue({ message: "ok" });

    const result = await requestPasswordResetCode("user@example.com");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should call requestPasswordReset with the correct email", async () => {
    vi.mocked(api.requestPasswordReset).mockResolvedValue({ message: "ok" });

    await requestPasswordResetCode("test@mail.com");

    expect(api.requestPasswordReset).toHaveBeenCalledWith({ email: "test@mail.com" });
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.requestPasswordReset).mockRejectedValue(new Error("Network error"));

    const result = await requestPasswordResetCode("user@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Send code error");
  });

  it("should call API exactly once per invocation", async () => {
    vi.mocked(api.requestPasswordReset).mockResolvedValue({ message: "ok" });

    await requestPasswordResetCode("a@b.com");

    expect(api.requestPasswordReset).toHaveBeenCalledTimes(1);
  });
});
