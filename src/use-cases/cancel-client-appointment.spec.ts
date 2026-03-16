import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/appointments-api", () => ({
  cancelAppointment: vi.fn(),
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
  MESSAGES: { appointments: { cancelError: "Cancel error" } },
}));

const api = await import("@/api/appointments-api");
const { cancelClientAppointment } = await import("./cancel-client-appointment");

describe("cancelClientAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when cancellation succeeds", async () => {
    vi.mocked(api.cancelAppointment).mockResolvedValue(undefined);

    const result = await cancelClientAppointment(42);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should call cancelAppointment with the correct appointment id", async () => {
    vi.mocked(api.cancelAppointment).mockResolvedValue(undefined);

    await cancelClientAppointment(99);

    expect(api.cancelAppointment).toHaveBeenCalledWith(99);
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.cancelAppointment).mockRejectedValue(new Error("Server error"));

    const result = await cancelClientAppointment(42);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Cancel error");
  });

  it("should call API exactly once", async () => {
    vi.mocked(api.cancelAppointment).mockResolvedValue(undefined);

    await cancelClientAppointment(1);

    expect(api.cancelAppointment).toHaveBeenCalledTimes(1);
  });
});
