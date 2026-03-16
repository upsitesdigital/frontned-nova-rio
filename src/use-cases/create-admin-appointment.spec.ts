import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-appointments-api", () => ({
  createAdminAppointment: vi.fn(),
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

vi.mock("@/lib/date-helpers", () => ({
  formatDateToISO: (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  },
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    auth: { sessionExpired: "Session expired" },
    adminAppointments: {
      createError: "Create error",
      requiredService: "Select service",
      requiredClient: "Select client",
      requiredDate: "Select date",
      requiredTime: "Select time",
    },
  },
}));

const api = await import("@/api/admin-appointments-api");
const { HttpClientError } = await import("@/api/http-client");
const { submitAdminAppointment } = await import("./create-admin-appointment");

const validInput = {
  serviceId: "1",
  recurrenceType: "SINGLE" as const,
  duration: "60",
  clientId: "2",
  employeeId: "3",
  locationZip: "20040-020",
  notes: "Test",
  selectedDate: new Date(2026, 2, 15),
  selectedTime: "10:00",
};

describe("submitAdminAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validation", () => {
    it("should return validation_error when serviceId is missing", async () => {
      const result = await submitAdminAppointment({ ...validInput, serviceId: "" });
      expect(result).toEqual({ type: "validation_error", message: "Select service" });
    });

    it("should return validation_error when clientId is missing", async () => {
      const result = await submitAdminAppointment({ ...validInput, clientId: "" });
      expect(result).toEqual({ type: "validation_error", message: "Select client" });
    });

    it("should return validation_error when selectedDate is missing", async () => {
      const result = await submitAdminAppointment({ ...validInput, selectedDate: undefined });
      expect(result).toEqual({ type: "validation_error", message: "Select date" });
    });

    it("should return validation_error when selectedTime is missing", async () => {
      const result = await submitAdminAppointment({ ...validInput, selectedTime: "" });
      expect(result).toEqual({ type: "validation_error", message: "Select time" });
    });
  });

  describe("success", () => {
    it("should return success on successful creation", async () => {
      vi.mocked(api.createAdminAppointment).mockResolvedValue({} as never);

      const result = await submitAdminAppointment(validInput);
      expect(result).toEqual({ type: "success" });
    });

    it("should pass correct payload to API", async () => {
      vi.mocked(api.createAdminAppointment).mockResolvedValue({} as never);

      await submitAdminAppointment(validInput);

      expect(api.createAdminAppointment).toHaveBeenCalledWith({
        date: "2026-03-15",
        startTime: "10:00",
        duration: 60,
        recurrenceType: "SINGLE",
        clientId: 2,
        serviceId: 1,
        employeeId: 3,
        locationZip: "20040-020",
        notes: "Test",
      });
    });

    it("should omit optional fields when empty", async () => {
      vi.mocked(api.createAdminAppointment).mockResolvedValue({} as never);

      await submitAdminAppointment({
        ...validInput,
        employeeId: "",
        locationZip: "",
        notes: "",
      });

      const payload = vi.mocked(api.createAdminAppointment).mock.calls[0][0];
      expect(payload.employeeId).toBeUndefined();
      expect(payload.locationZip).toBeUndefined();
      expect(payload.notes).toBeUndefined();
    });

    it("should omit employeeId when set to none", async () => {
      vi.mocked(api.createAdminAppointment).mockResolvedValue({} as never);

      await submitAdminAppointment({ ...validInput, employeeId: "none" });

      const payload = vi.mocked(api.createAdminAppointment).mock.calls[0][0];
      expect(payload.employeeId).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("should return auth_error on 401", async () => {
      vi.mocked(api.createAdminAppointment).mockRejectedValue(
        new HttpClientError(401, "Unauthorized"),
      );

      const result = await submitAdminAppointment(validInput);
      expect(result).toEqual({ type: "auth_error", message: "Session expired" });
    });

    it("should return auth_error on 403", async () => {
      vi.mocked(api.createAdminAppointment).mockRejectedValue(
        new HttpClientError(403, "Forbidden"),
      );

      const result = await submitAdminAppointment(validInput);
      expect(result).toEqual({ type: "auth_error", message: "Session expired" });
    });

    it("should return employee_conflict on 400 with conflict message", async () => {
      vi.mocked(api.createAdminAppointment).mockRejectedValue(
        new HttpClientError(400, "Employee has a conflict at this time"),
      );

      const result = await submitAdminAppointment(validInput);
      expect(result).toEqual({
        type: "employee_conflict",
        message: "Employee has a conflict at this time",
      });
    });

    it("should return generic error on 400 without conflict", async () => {
      vi.mocked(api.createAdminAppointment).mockRejectedValue(
        new HttpClientError(400, "Bad request"),
      );

      const result = await submitAdminAppointment(validInput);
      expect(result).toEqual({ type: "error", message: "Create error" });
    });

    it("should return generic error on network failure", async () => {
      vi.mocked(api.createAdminAppointment).mockRejectedValue(new Error("Network error"));

      const result = await submitAdminAppointment(validInput);
      expect(result).toEqual({ type: "error", message: "Create error" });
    });
  });
});
