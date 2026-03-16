import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminEmployeeScheduleStore } from "./admin-employee-schedule-store";

vi.mock("@/api/admin-appointments-api", () => ({
  fetchAdminAppointments: vi.fn(),
}));

vi.mock("@/lib/auth-helpers", () => ({
  isAuthError: vi.fn(() => false),
  resolveErrorMessage: vi.fn((_error: unknown, fallback: string) => fallback),
}));

const { fetchAdminAppointments } = await import("@/api/admin-appointments-api");

function resetStore() {
  useAdminEmployeeScheduleStore.setState({
    open: false,
    employeeId: null,
    employeeName: "",
    currentMonth: new Date(),
    busyDates: [],
    isLoading: false,
    error: null,
    isAuthError: false,
  });
}

describe("AdminEmployeeScheduleStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("openSchedule", () => {
    it("should set employee data and open the panel", () => {
      vi.mocked(fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 100,
      });

      useAdminEmployeeScheduleStore.getState().openSchedule(5, "Carlos Magno");

      const state = useAdminEmployeeScheduleStore.getState();
      expect(state.open).toBe(true);
      expect(state.employeeId).toBe(5);
      expect(state.employeeName).toBe("Carlos Magno");
    });

    it("should trigger loadBusyDates on open", () => {
      vi.mocked(fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 100,
      });

      useAdminEmployeeScheduleStore.getState().openSchedule(5, "Carlos");

      expect(fetchAdminAppointments).toHaveBeenCalled();
    });
  });

  describe("closeSchedule", () => {
    it("should reset panel state", () => {
      vi.mocked(fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 100,
      });

      useAdminEmployeeScheduleStore.getState().openSchedule(5, "Carlos");
      useAdminEmployeeScheduleStore.getState().closeSchedule();

      const state = useAdminEmployeeScheduleStore.getState();
      expect(state.open).toBe(false);
      expect(state.employeeId).toBeNull();
      expect(state.employeeName).toBe("");
      expect(state.busyDates).toEqual([]);
    });
  });

  describe("loadBusyDates", () => {
    it("should load busy dates for current month", async () => {
      const baseAppointment = {
        id: 1,
        uuid: "uuid-1",
        startTime: "09:00",
        duration: 120,
        status: "SCHEDULED" as const,
        recurrenceType: "SINGLE" as const,
        locationZip: null,
        locationAddress: null,
        notes: null,
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-01T00:00:00.000Z",
        client: { id: 1, name: "João", email: "joao@test.com" },
        service: { id: 1, name: "Faxina" },
        employee: { id: 5, name: "Carlos" },
        package: null,
        unit: null,
      };
      const appointments = [
        { ...baseAppointment, id: 1, date: "2026-03-10T00:00:00.000Z" },
        { ...baseAppointment, id: 2, date: "2026-03-15T00:00:00.000Z" },
      ];
      vi.mocked(fetchAdminAppointments).mockResolvedValue({
        data: appointments,
        total: 2,
        page: 1,
        limit: 100,
      });

      useAdminEmployeeScheduleStore.setState({ employeeId: 5 });
      await useAdminEmployeeScheduleStore.getState().loadBusyDates();

      const state = useAdminEmployeeScheduleStore.getState();
      expect(state.busyDates).toHaveLength(2);
      expect(state.isLoading).toBe(false);
    });

    it("should not fetch when no employeeId", async () => {
      await useAdminEmployeeScheduleStore.getState().loadBusyDates();

      expect(fetchAdminAppointments).not.toHaveBeenCalled();
    });

    it("should set error on failure", async () => {
      vi.mocked(fetchAdminAppointments).mockRejectedValue(new Error("Network error"));

      useAdminEmployeeScheduleStore.setState({ employeeId: 5 });
      await useAdminEmployeeScheduleStore.getState().loadBusyDates();

      const state = useAdminEmployeeScheduleStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Erro ao carregar agenda");
    });

    it("should pass correct params including employeeId and SCHEDULED status", async () => {
      vi.mocked(fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 100,
      });

      useAdminEmployeeScheduleStore.setState({ employeeId: 7 });
      await useAdminEmployeeScheduleStore.getState().loadBusyDates();

      expect(fetchAdminAppointments).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: 7,
          status: "SCHEDULED",
          limit: 100,
        }),
      );
    });
  });

  describe("setCurrentMonth", () => {
    it("should update current month and reload busy dates", () => {
      vi.mocked(fetchAdminAppointments).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 100,
      });

      useAdminEmployeeScheduleStore.setState({ employeeId: 5 });
      const newMonth = new Date(2026, 3, 1);
      useAdminEmployeeScheduleStore.getState().setCurrentMonth(newMonth);

      expect(useAdminEmployeeScheduleStore.getState().currentMonth).toEqual(newMonth);
      expect(fetchAdminAppointments).toHaveBeenCalled();
    });
  });
});
