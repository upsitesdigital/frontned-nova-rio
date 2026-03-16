import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminEmployeeEditStore } from "./admin-employee-edit-store";

vi.mock("@/api/admin-employees-api", () => ({
  fetchAdminEmployeeById: vi.fn(),
  updateAdminEmployee: vi.fn(),
}));

vi.mock("@/api/admin-appointments-api", () => ({
  fetchAdminAppointments: vi.fn(),
  fetchUnits: vi.fn(),
}));

vi.mock("@/stores/toast-store", () => ({
  useToastStore: { getState: () => ({ showToast: vi.fn() }) },
}));

vi.mock("@/lib/auth-helpers", () => ({
  isAuthError: vi.fn(() => false),
  resolveErrorMessage: vi.fn((_error: unknown, fallback: string) => fallback),
}));

const { fetchAdminEmployeeById, updateAdminEmployee } = await import("@/api/admin-employees-api");
const { fetchAdminAppointments, fetchUnits } = await import("@/api/admin-appointments-api");

const mockEmployee = {
  id: 1,
  uuid: "uuid-1",
  name: "Carlos Magno",
  email: "carlos@test.com",
  phone: "+5521999999999",
  cpf: "12345678901",
  address: "Rua Test",
  avatarUrl: null,
  status: "ACTIVE" as const,
  availabilityFrom: "08:00",
  availabilityTo: "18:00",
  notes: "Bom funcionário",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
  unit: { id: 1, name: "Centro" },
};

function resetStore() {
  useAdminEmployeeEditStore.getState().reset();
}

describe("AdminEmployeeEditStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("loadEmployee", () => {
    it("should load employee and populate form", async () => {
      vi.mocked(fetchAdminEmployeeById).mockResolvedValue(mockEmployee);
      vi.mocked(fetchUnits).mockResolvedValue([{ id: 1, name: "Centro", isActive: true }]);
      vi.mocked(fetchAdminAppointments).mockResolvedValue({ data: [], total: 0, page: 1, limit: 100 });

      await useAdminEmployeeEditStore.getState().loadEmployee(1);

      const state = useAdminEmployeeEditStore.getState();
      expect(state.employee).toEqual(mockEmployee);
      expect(state.form.name).toBe("Carlos Magno");
      expect(state.form.email).toBe("carlos@test.com");
      expect(state.form.cpf).toBe("12345678901");
      expect(state.form.unitId).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle missing optional fields", async () => {
      const employee = { ...mockEmployee, phone: null, address: null, unit: null, notes: null, availabilityFrom: null, availabilityTo: null };
      vi.mocked(fetchAdminEmployeeById).mockResolvedValue(employee);
      vi.mocked(fetchUnits).mockResolvedValue([]);
      vi.mocked(fetchAdminAppointments).mockResolvedValue({ data: [], total: 0, page: 1, limit: 100 });

      await useAdminEmployeeEditStore.getState().loadEmployee(1);

      const state = useAdminEmployeeEditStore.getState();
      expect(state.form.phone).toBe("");
      expect(state.form.address).toBe("");
      expect(state.form.unitId).toBeNull();
      expect(state.form.unitName).toBe("");
      expect(state.form.notes).toBe("");
    });

    it("should set error on failure", async () => {
      vi.mocked(fetchAdminEmployeeById).mockRejectedValue(new Error("Not found"));
      vi.mocked(fetchUnits).mockResolvedValue([]);

      await useAdminEmployeeEditStore.getState().loadEmployee(999);

      const state = useAdminEmployeeEditStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Erro ao carregar funcionário");
    });

    it("should still succeed if fetchUnits fails", async () => {
      vi.mocked(fetchAdminEmployeeById).mockResolvedValue(mockEmployee);
      vi.mocked(fetchUnits).mockRejectedValue(new Error("fail"));
      vi.mocked(fetchAdminAppointments).mockResolvedValue({ data: [], total: 0, page: 1, limit: 100 });

      await useAdminEmployeeEditStore.getState().loadEmployee(1);

      const state = useAdminEmployeeEditStore.getState();
      expect(state.employee).toEqual(mockEmployee);
      expect(state.unitOptions).toEqual([]);
    });
  });

  describe("updateField", () => {
    it("should update a single form field immutably", () => {
      useAdminEmployeeEditStore.getState().updateField("name", "New Name");

      expect(useAdminEmployeeEditStore.getState().form.name).toBe("New Name");
    });
  });

  describe("saveEmployee", () => {
    it("should save employee successfully", async () => {
      vi.mocked(fetchAdminEmployeeById).mockResolvedValue(mockEmployee);
      vi.mocked(fetchUnits).mockResolvedValue([]);
      vi.mocked(fetchAdminAppointments).mockResolvedValue({ data: [], total: 0, page: 1, limit: 100 });
      vi.mocked(updateAdminEmployee).mockResolvedValue(mockEmployee);

      await useAdminEmployeeEditStore.getState().loadEmployee(1);
      const result = await useAdminEmployeeEditStore.getState().saveEmployee();

      expect(result).toBe(true);
      expect(updateAdminEmployee).toHaveBeenCalledWith(1, expect.objectContaining({ name: "Carlos Magno" }));
      expect(useAdminEmployeeEditStore.getState().isSaving).toBe(false);
    });

    it("should return false when no employee is loaded", async () => {
      const result = await useAdminEmployeeEditStore.getState().saveEmployee();

      expect(result).toBe(false);
      expect(updateAdminEmployee).not.toHaveBeenCalled();
    });

    it("should set saveError on failure", async () => {
      vi.mocked(fetchAdminEmployeeById).mockResolvedValue(mockEmployee);
      vi.mocked(fetchUnits).mockResolvedValue([]);
      vi.mocked(fetchAdminAppointments).mockResolvedValue({ data: [], total: 0, page: 1, limit: 100 });
      vi.mocked(updateAdminEmployee).mockRejectedValue(new Error("Server error"));

      await useAdminEmployeeEditStore.getState().loadEmployee(1);
      const result = await useAdminEmployeeEditStore.getState().saveEmployee();

      expect(result).toBe(false);
      expect(useAdminEmployeeEditStore.getState().saveError).toBe("Erro ao salvar funcionário");
      expect(useAdminEmployeeEditStore.getState().isSaving).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", async () => {
      vi.mocked(fetchAdminEmployeeById).mockResolvedValue(mockEmployee);
      vi.mocked(fetchUnits).mockResolvedValue([]);
      vi.mocked(fetchAdminAppointments).mockResolvedValue({ data: [], total: 0, page: 1, limit: 100 });

      await useAdminEmployeeEditStore.getState().loadEmployee(1);
      useAdminEmployeeEditStore.getState().reset();

      const state = useAdminEmployeeEditStore.getState();
      expect(state.employee).toBeNull();
      expect(state.form.name).toBe("");
      expect(state.isLoading).toBe(false);
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
      expect(state.saveError).toBeNull();
      expect(state.unitOptions).toEqual([]);
      expect(state.busyDates).toEqual([]);
    });
  });
});
