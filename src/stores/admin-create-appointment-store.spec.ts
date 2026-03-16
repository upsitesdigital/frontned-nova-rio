import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminCreateAppointmentStore } from "./admin-create-appointment-store";

vi.mock("@/use-cases/create-admin-appointment", () => ({
  submitAdminAppointment: vi.fn(),
}));

vi.mock("@/use-cases/get-approved-client-options", () => ({
  getApprovedClientOptions: vi.fn(),
}));

vi.mock("@/use-cases/get-admin-service-options", () => ({
  getAdminServiceOptions: vi.fn(),
}));

vi.mock("@/use-cases/get-active-employee-options", () => ({
  getActiveEmployeeOptions: vi.fn(),
}));

const createUseCase = await import("@/use-cases/create-admin-appointment");
const clientOptionsUseCase = await import("@/use-cases/get-approved-client-options");
const serviceOptionsUseCase = await import("@/use-cases/get-admin-service-options");
const employeeOptionsUseCase = await import("@/use-cases/get-active-employee-options");

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
      vi.mocked(clientOptionsUseCase.getApprovedClientOptions).mockResolvedValue({
        data: [{ id: 1, name: "Maria" }],
        error: null,
      });
      vi.mocked(serviceOptionsUseCase.getAdminServiceOptions).mockResolvedValue({
        data: [
          {
            id: 1,
            name: "Faxina",
            allowSingle: true,
            allowPackage: false,
            allowRecurrence: false,
          },
        ],
        error: null,
      });
      vi.mocked(employeeOptionsUseCase.getActiveEmployeeOptions).mockResolvedValue({
        data: [{ id: 1, name: "Carlos" }],
        error: null,
      });

      await useAdminCreateAppointmentStore.getState().loadOptions();

      const state = useAdminCreateAppointmentStore.getState();
      expect(state.clientOptions).toEqual([{ id: 1, name: "Maria" }]);
      expect(state.serviceOptions).toHaveLength(1);
      expect(state.employeeOptions).toEqual([{ id: 1, name: "Carlos" }]);
      expect(state.isOptionsLoading).toBe(false);
    });

    it("should handle partial failures gracefully", async () => {
      vi.mocked(clientOptionsUseCase.getApprovedClientOptions).mockRejectedValue(new Error("fail"));
      vi.mocked(serviceOptionsUseCase.getAdminServiceOptions).mockResolvedValue({
        data: [],
        error: null,
      });
      vi.mocked(employeeOptionsUseCase.getActiveEmployeeOptions).mockResolvedValue({
        data: [{ id: 1, name: "Carlos" }],
        error: null,
      });

      await useAdminCreateAppointmentStore.getState().loadOptions();

      const state = useAdminCreateAppointmentStore.getState();
      expect(state.clientOptions).toEqual([]);
      expect(state.employeeOptions).toEqual([{ id: 1, name: "Carlos" }]);
    });
  });

  describe("submitAppointment", () => {
    it("should return false on validation error", async () => {
      vi.mocked(createUseCase.submitAdminAppointment).mockResolvedValue({
        type: "validation_error",
        message: "Selecione o serviço",
      });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(false);
      expect(useAdminCreateAppointmentStore.getState().error).toBe("Selecione o serviço");
    });

    it("should return true on success", async () => {
      vi.mocked(createUseCase.submitAdminAppointment).mockResolvedValue({ type: "success" });

      useAdminCreateAppointmentStore.setState({
        serviceId: "1",
        clientId: "2",
        selectedDate: new Date(2026, 2, 15),
        selectedTime: "10:00",
      });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(true);
      expect(useAdminCreateAppointmentStore.getState().success).toBe(true);
    });

    it("should pass form state to use case", async () => {
      vi.mocked(createUseCase.submitAdminAppointment).mockResolvedValue({ type: "success" });

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

      await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(createUseCase.submitAdminAppointment).toHaveBeenCalledWith({
        serviceId: "1",
        clientId: "2",
        employeeId: "3",
        duration: "60",
        recurrenceType: "SINGLE",
        selectedDate: expect.any(Date),
        selectedTime: "10:00",
        locationZip: "20040-020",
        notes: "Test notes",
      });
    });

    it("should handle employee conflict", async () => {
      vi.mocked(createUseCase.submitAdminAppointment).mockResolvedValue({
        type: "employee_conflict",
        message: "Employee has a conflict",
      });

      useAdminCreateAppointmentStore.setState({
        serviceId: "1",
        clientId: "2",
        selectedDate: new Date(2026, 2, 15),
        selectedTime: "10:00",
      });

      const result = await useAdminCreateAppointmentStore.getState().submitAppointment();

      expect(result).toBe(false);
      expect(useAdminCreateAppointmentStore.getState().employeeConflict).toBe(
        "Employee has a conflict",
      );
      expect(useAdminCreateAppointmentStore.getState().error).toBeNull();
    });

    it("should set error on generic failure", async () => {
      vi.mocked(createUseCase.submitAdminAppointment).mockResolvedValue({
        type: "error",
        message: "Erro ao criar",
      });

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
