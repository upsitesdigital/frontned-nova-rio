import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/appointments-api", () => ({
  rescheduleAppointment: vi.fn(),
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
  MESSAGES: {
    appointments: { rescheduleError: "Reschedule error" },
  },
}));

const api = await import("@/api/appointments-api");
const { rescheduleClientAppointment } = await import("./reschedule-client-appointment");

const validParams = {
  appointmentId: 10,
  date: new Date(2026, 2, 20),
  time: "14:00",
};

describe("rescheduleClientAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return success when rescheduling succeeds", async () => {
      vi.mocked(api.rescheduleAppointment).mockResolvedValue({} as never);

      const result = await rescheduleClientAppointment(validParams);

      expect(result).toEqual({ success: true, error: null });
    });

    it("should call API with formatted date and correct params", async () => {
      vi.mocked(api.rescheduleAppointment).mockResolvedValue({} as never);

      await rescheduleClientAppointment(validParams);

      expect(api.rescheduleAppointment).toHaveBeenCalledWith(10, {
        date: "2026-03-20",
        startTime: "14:00",
      });
    });
  });

  describe("error handling", () => {
    it("should return error with fallback message on failure", async () => {
      vi.mocked(api.rescheduleAppointment).mockRejectedValue(new Error("Network error"));

      const result = await rescheduleClientAppointment(validParams);

      expect(result).toEqual({ success: false, error: "Reschedule error" });
    });
  });
});
