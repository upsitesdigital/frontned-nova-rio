import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminCreateAppointmentStore } from "./admin-create-appointment-store";

vi.mock("@/api/admin-appointments-api", () => ({
  fetchClientOptions: vi.fn(),
  fetchServiceOptions: vi.fn(),
  fetchEmployeeOptions: vi.fn(),
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
  resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    adminAppointments: {
      createSuccess: "Agendamento criado!",
      createError: "Erro ao criar",
      requiredService: "Selecione o serviço",
      requiredClient: "Selecione o cliente",
      requiredDate: "Selecione a data",
      requiredTime: "Selecione o horário",
    },
  },
}));

const api = await import("@/api/admin-appointments-api");

function resetStore() {
  useAdminCreateAppointmentStore.getState().reset();
}

describe("AdminCreateAppointmentStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("loadOptions", () => {
    it("should load all options successfully", async () => {
      vi.mocked(api.fetchClientOptions).mockResolvedValue([{ id: 1, name: "Maria" }]);
      vi.mocked(api.fetchServiceOptions).mockResolvedValue([
        { id: 1, name: "Faxina", allowSingle: true, allowPackage: false, allowRecurrence: false },
      ]);
      vi.mocked(api.fetchEmployeeOptions).mockResolvedValue([{ id: 1, name: "Carlos" }]);

      await useAdminCreateAppointmentStore.getState().loadOptions();

      const state = useAdminCreateAppointmentStore.getState();
      expect(state.clientOptions).toEqual([{ id: 1, name: "Maria" }]);
      expect(state.serviceOptions).toHaveLength(1);
      expect(state.employeeOptions).toEqual([{ id: 1, name: "Carlos" }]);
      expect(state.isOptionsLoading).toBe(false);
    });

    it("should handle partial failures gracefully", async () => {
      vi.mocked(api.fetchClientOptions).mockRejectedValue(new Error("fail"));
      vi.mocked(api.fetchServiceOptions).mockResolvedValue([]);
      vi.mocked(api.fetchEmployeeOptions).mockResolvedValue([{ id: 1, name: "Carlos" }]);

      await useAdminCreateAppointmentStore.getState().loadOptions();

      const state = useAdminCreateAppointmentStore.getState();
      expect(state.clientOptions).toEqual([]);
      expect(state.employeeOptions).toEqual([{ id: 1, name: "Carlos" }]);
    });
  });

  describe("submitAppointment", () => {
    it("should validate required service", async () => {
      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(false);
      expect(useAdminCreateAppointmentStore.getState().error).toBe("Selecione o serviço");
    });

    it("should validate required client", async () => {
      useAdminCreateAppointmentStore.setState({ serviceId: "1" });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(false);
      expect(useAdminCreateAppointmentStore.getState().error).toBe("Selecione o cliente");
    });

    it("should validate required date", async () => {
      useAdminCreateAppointmentStore.setState({ serviceId: "1", clientId: "1" });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(false);
      expect(useAdminCreateAppointmentStore.getState().error).toBe("Selecione a data");
    });

    it("should validate required time", async () => {
      useAdminCreateAppointmentStore.setState({
        serviceId: "1",
        clientId: "1",
        selectedDate: new Date(2026, 2, 15),
      });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(false);
      expect(useAdminCreateAppointmentStore.getState().error).toBe("Selecione o horário");
    });

    it("should submit successfully with valid data", async () => {
      vi.mocked(api.createAdminAppointment).mockResolvedValue({} as never);

      useAdminCreateAppointmentStore.setState({
        serviceId: "1",
        clientId: "2",
        employeeId: "3",
        duration: "60",
        recurrenceType: "SINGLE",
        selectedDate: new Date(2026, 2, 15),
        selectedTime: "10:00",
        locationZip: "20040-020",
        notes: "Test notes",
      });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(true);
      expect(api.createAdminAppointment).toHaveBeenCalledWith({
        date: "2026-03-15",
        startTime: "10:00",
        duration: 60,
        recurrenceType: "SINGLE",
        clientId: 2,
        serviceId: 1,
        employeeId: 3,
        locationZip: "20040-020",
        notes: "Test notes",
      });
      expect(useAdminCreateAppointmentStore.getState().success).toBe(true);
    });

    it("should omit optional fields when empty", async () => {
      vi.mocked(api.createAdminAppointment).mockResolvedValue({} as never);

      useAdminCreateAppointmentStore.setState({
        serviceId: "1",
        clientId: "2",
        selectedDate: new Date(2026, 2, 15),
        selectedTime: "10:00",
      });

      await useAdminCreateAppointmentStore.getState().submitAppointment();

      const payload = vi.mocked(api.createAdminAppointment).mock.calls[0][0];
      expect(payload.employeeId).toBeUndefined();
      expect(payload.locationZip).toBeUndefined();
      expect(payload.notes).toBeUndefined();
    });

    it("should set error on API failure", async () => {
      vi.mocked(api.createAdminAppointment).mockRejectedValue(new Error("Network error"));

      useAdminCreateAppointmentStore.setState({
        serviceId: "1",
        clientId: "2",
        selectedDate: new Date(2026, 2, 15),
        selectedTime: "10:00",
      });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(false);
      expect(useAdminCreateAppointmentStore.getState().error).toBe("Erro ao criar");
      expect(useAdminCreateAppointmentStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("setters", () => {
    it("should clear error when setting fields", () => {
      useAdminCreateAppointmentStore.setState({ error: "Some error" });

      useAdminCreateAppointmentStore.getState().setServiceId("1");
      expect(useAdminCreateAppointmentStore.getState().error).toBeNull();
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useAdminCreateAppointmentStore.setState({
        serviceId: "1",
        clientId: "2",
        error: "err",
        success: true,
      });

      useAdminCreateAppointmentStore.getState().reset();

      const state = useAdminCreateAppointmentStore.getState();
      expect(state.serviceId).toBe("");
      expect(state.clientId).toBe("");
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });
  });
});
