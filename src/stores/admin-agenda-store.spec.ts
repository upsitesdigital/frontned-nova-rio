import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminAgendaStore } from "./admin-agenda-store";

const mockAgendaItems = [
  {
    appointmentId: 1,
    clientName: "Client",
    serviceName: "Clean",
    startTime: "09:00",
    duration: 60,
    status: "CONFIRMED",
    date: "2026-03-15",
  },
];

vi.mock("@/use-cases/load-admin-agenda", () => ({
  loadTodayAgenda: vi.fn(),
}));

const { loadTodayAgenda } = await import("@/use-cases/load-admin-agenda");

function resetStore() {
  useAdminAgendaStore.getState().reset();
}

describe("AdminAgendaStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("hydrateFromDashboard", () => {
    it("should set agenda items and service options", () => {
      const options = [{ id: 1, name: "Limpeza" }];

      useAdminAgendaStore.getState().hydrateFromDashboard(mockAgendaItems, 1, options);

      const state = useAdminAgendaStore.getState();
      expect(state.agendaItems).toEqual(mockAgendaItems);
      expect(state.agendaTotal).toBe(1);
      expect(state.serviceOptions).toEqual(options);
      expect(state.agendaPage).toBe(1);
    });
  });

  describe("loadAgenda", () => {
    it("should load agenda items", async () => {
      vi.mocked(loadTodayAgenda).mockResolvedValue({
        items: mockAgendaItems,
        total: 1,
        error: null,
        isAuthError: false,
      });

      await useAdminAgendaStore.getState().loadAgenda(1);

      const state = useAdminAgendaStore.getState();
      expect(state.agendaItems).toEqual(mockAgendaItems);
      expect(state.agendaTotal).toBe(1);
      expect(state.agendaPage).toBe(1);
      expect(state.isAgendaLoading).toBe(false);
    });

    it("should set isAuthError on auth failure", async () => {
      vi.mocked(loadTodayAgenda).mockResolvedValue({
        items: null,
        total: null,
        error: null,
        isAuthError: true,
      });

      await useAdminAgendaStore.getState().loadAgenda(1);

      expect(useAdminAgendaStore.getState().isAuthError).toBe(true);
    });

    it("should pass serviceId to use case", async () => {
      vi.mocked(loadTodayAgenda).mockResolvedValue({
        items: [],
        total: 0,
        error: null,
        isAuthError: false,
      });

      await useAdminAgendaStore.getState().loadAgenda(2, 5);

      expect(loadTodayAgenda).toHaveBeenCalledWith(2, 6, 5, expect.any(AbortSignal));
    });

    it("should not set auth error on non-auth failure", async () => {
      vi.mocked(loadTodayAgenda).mockResolvedValue({
        items: null,
        total: null,
        error: null,
        isAuthError: false,
      });

      await useAdminAgendaStore.getState().loadAgenda(1);

      expect(useAdminAgendaStore.getState().isAuthError).toBe(false);
      expect(useAdminAgendaStore.getState().isAgendaLoading).toBe(false);
    });
  });

  describe("setAgendaPage", () => {
    it("should call loadAgenda with correct page and service filter", async () => {
      vi.mocked(loadTodayAgenda).mockResolvedValue({
        items: [],
        total: 0,
        error: null,
        isAuthError: false,
      });
      useAdminAgendaStore.setState({ agendaServiceFilter: "5" });

      useAdminAgendaStore.getState().setAgendaPage(3);

      expect(loadTodayAgenda).toHaveBeenCalledWith(3, 6, 5, expect.any(AbortSignal));
    });

    it("should pass undefined serviceId for 'all' filter", async () => {
      vi.mocked(loadTodayAgenda).mockResolvedValue({
        items: [],
        total: 0,
        error: null,
        isAuthError: false,
      });
      useAdminAgendaStore.setState({ agendaServiceFilter: "all" });

      useAdminAgendaStore.getState().setAgendaPage(1);

      expect(loadTodayAgenda).toHaveBeenCalledWith(1, 6, undefined, expect.any(AbortSignal));
    });
  });

  describe("setAgendaServiceFilter", () => {
    it("should clear items and set loading on filter change", () => {
      useAdminAgendaStore.setState({ agendaItems: mockAgendaItems });
      vi.mocked(loadTodayAgenda).mockResolvedValue({
        items: [],
        total: 0,
        error: null,
        isAuthError: false,
      });

      useAdminAgendaStore.getState().setAgendaServiceFilter("1");

      const state = useAdminAgendaStore.getState();
      expect(state.agendaServiceFilter).toBe("1");
      expect(state.agendaPage).toBe(1);
      expect(state.isAgendaLoading).toBe(true);
      expect(state.agendaItems).toEqual([]);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useAdminAgendaStore.setState({
        agendaItems: mockAgendaItems,
        agendaTotal: 5,
        agendaPage: 3,
        agendaServiceFilter: "2",
      });

      useAdminAgendaStore.getState().reset();

      const state = useAdminAgendaStore.getState();
      expect(state.agendaItems).toEqual([]);
      expect(state.agendaTotal).toBe(0);
      expect(state.agendaPage).toBe(1);
      expect(state.agendaServiceFilter).toBe("all");
    });
  });
});
