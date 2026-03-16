import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/load-time-slots", () => ({
  loadTimeSlots: vi.fn(),
}));

const { loadTimeSlots } = await import("@/use-cases/load-time-slots");
const { useSchedulingStore } = await import("./scheduling-store");

describe("SchedulingStore", () => {
  beforeEach(() => {
    useSchedulingStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have default values", () => {
      const state = useSchedulingStore.getState();

      expect(state.recurrenceType).toBeNull();
      expect(state.recurrenceFrequency).toBeNull();
      expect(state.selectedDate).toBeNull();
      expect(state.selectedTime).toBeNull();
      expect(state.timeSlots).toEqual([]);
      expect(state.isLoadingTimeSlots).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("setRecurrenceType", () => {
    it("should set recurrenceType and null frequency for avulso", () => {
      useSchedulingStore.getState().setRecurrenceType("avulso");

      const state = useSchedulingStore.getState();
      expect(state.recurrenceType).toBe("avulso");
      expect(state.recurrenceFrequency).toBeNull();
    });

    it("should set recurrenceType and default mensal frequency for recorrencia", () => {
      useSchedulingStore.getState().setRecurrenceType("recorrencia");

      const state = useSchedulingStore.getState();
      expect(state.recurrenceType).toBe("recorrencia");
      expect(state.recurrenceFrequency).toBe("mensal");
    });

    it("should set recurrenceType and null frequency for pacote", () => {
      useSchedulingStore.getState().setRecurrenceType("pacote");

      const state = useSchedulingStore.getState();
      expect(state.recurrenceType).toBe("pacote");
      expect(state.recurrenceFrequency).toBeNull();
    });
  });

  describe("setRecurrenceFrequency", () => {
    it("should update recurrence frequency", () => {
      useSchedulingStore.getState().setRecurrenceFrequency("semanal");

      expect(useSchedulingStore.getState().recurrenceFrequency).toBe("semanal");
    });
  });

  describe("setSelectedDate", () => {
    it("should update selected date", () => {
      const date = new Date(2026, 2, 20);

      useSchedulingStore.getState().setSelectedDate(date);

      expect(useSchedulingStore.getState().selectedDate).toEqual(date);
    });

    it("should accept null", () => {
      useSchedulingStore.setState({ selectedDate: new Date() });

      useSchedulingStore.getState().setSelectedDate(null);

      expect(useSchedulingStore.getState().selectedDate).toBeNull();
    });
  });

  describe("setSelectedTime", () => {
    it("should update selected time", () => {
      useSchedulingStore.getState().setSelectedTime("10:00");

      expect(useSchedulingStore.getState().selectedTime).toBe("10:00");
    });

    it("should accept null", () => {
      useSchedulingStore.setState({ selectedTime: "10:00" });

      useSchedulingStore.getState().setSelectedTime(null);

      expect(useSchedulingStore.getState().selectedTime).toBeNull();
    });
  });

  describe("loadTimeSlots", () => {
    it("should load time slots on success", async () => {
      const slots = [
        { time: "08:00", available: true },
        { time: "10:00", available: false },
      ];
      vi.mocked(loadTimeSlots).mockResolvedValue({ data: slots, error: null });

      await useSchedulingStore.getState().loadTimeSlots("2026-03-20");

      const state = useSchedulingStore.getState();
      expect(state.timeSlots).toEqual(slots);
      expect(state.isLoadingTimeSlots).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set error on failure", async () => {
      vi.mocked(loadTimeSlots).mockResolvedValue({
        data: null,
        error: "Erro ao carregar horarios.",
      });

      await useSchedulingStore.getState().loadTimeSlots("2026-03-20");

      const state = useSchedulingStore.getState();
      expect(state.timeSlots).toEqual([]);
      expect(state.error).toBe("Erro ao carregar horarios.");
      expect(state.isLoadingTimeSlots).toBe(false);
    });

    it("should set isLoadingTimeSlots during API call", async () => {
      let resolveLoad!: (
        value: { data: never[]; error: null },
      ) => void;
      vi.mocked(loadTimeSlots).mockReturnValue(
        new Promise((resolve) => {
          resolveLoad = resolve;
        }),
      );

      const loadPromise = useSchedulingStore.getState().loadTimeSlots("2026-03-20");

      expect(useSchedulingStore.getState().isLoadingTimeSlots).toBe(true);

      resolveLoad({ data: [], error: null });
      await loadPromise;

      expect(useSchedulingStore.getState().isLoadingTimeSlots).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useSchedulingStore.setState({
        recurrenceType: "avulso",
        recurrenceFrequency: "mensal",
        selectedDate: new Date(),
        selectedTime: "10:00",
        timeSlots: [{ time: "08:00", available: true }],
        isLoadingTimeSlots: true,
        error: "err",
      });

      useSchedulingStore.getState().reset();

      const state = useSchedulingStore.getState();
      expect(state.recurrenceType).toBeNull();
      expect(state.recurrenceFrequency).toBeNull();
      expect(state.selectedDate).toBeNull();
      expect(state.selectedTime).toBeNull();
      expect(state.timeSlots).toEqual([]);
      expect(state.isLoadingTimeSlots).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
