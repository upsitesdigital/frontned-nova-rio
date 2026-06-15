import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/client/appointments-api", () => ({
  AppointmentsApi: { cancelAppointment: vi.fn() },
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
  Messages: { appointments: { cancelError: "Cancel error" } },
}));

const api = await import("@/api/client/appointments-api");
const { CancelClientAppointment } = await import("./cancel-client-appointment");

describe("cancelClientAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when cancellation succeeds", async () => {
    vi.mocked(api.AppointmentsApi.cancelAppointment).mockResolvedValue(undefined);

    const result = await CancelClientAppointment.cancelClientAppointment(42);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should call cancelAppointment with the correct appointment id", async () => {
    vi.mocked(api.AppointmentsApi.cancelAppointment).mockResolvedValue(undefined);

    await CancelClientAppointment.cancelClientAppointment(99);

    expect(api.AppointmentsApi.cancelAppointment).toHaveBeenCalledWith(99);
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.AppointmentsApi.cancelAppointment).mockRejectedValue(new Error("Server error"));

    const result = await CancelClientAppointment.cancelClientAppointment(42);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Cancel error");
  });

  it("should call API exactly once", async () => {
    vi.mocked(api.AppointmentsApi.cancelAppointment).mockResolvedValue(undefined);

    await CancelClientAppointment.cancelClientAppointment(1);

    expect(api.AppointmentsApi.cancelAppointment).toHaveBeenCalledTimes(1);
  });
});
