import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/load-client-dashboard", () => ({
  loadClientDashboard: vi.fn(),
}));

const { loadClientDashboard } = await import("@/use-cases/load-client-dashboard");

import { useDashboardStore } from "./dashboard-store";

const mockSummary = {
  upcomingAppointments: [],
  serviceHistory: [],
  stats: { totalServices: 10 },
};

describe("DashboardStore", () => {
  beforeEach(() => {
    useDashboardStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useDashboardStore.getState();

      expect(state.summary).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthError).toBe(false);
      expect(state.selectedDetailEntry).toBeNull();
      expect(state.editEntry).toBeNull();
      expect(state.serviceHistoryFilter).toBe("recent");
      expect(state.sidePanelRecurrenceType).toBe("monthly");
    });
  });

  describe("loadSummary", () => {
    it("should set summary on success", async () => {
      vi.mocked(loadClientDashboard).mockResolvedValue({
        data: mockSummary as never,
        error: null,
        isAuthError: false,
      });

      await useDashboardStore.getState().loadSummary();

      const state = useDashboardStore.getState();
      expect(state.summary).toEqual(mockSummary);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthError).toBe(false);
    });

    it("should set error on failure", async () => {
      vi.mocked(loadClientDashboard).mockResolvedValue({
        data: null,
        error: "Failed to load",
        isAuthError: false,
      });

      await useDashboardStore.getState().loadSummary();

      const state = useDashboardStore.getState();
      expect(state.summary).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Failed to load");
    });

    it("should set isAuthError when auth fails", async () => {
      vi.mocked(loadClientDashboard).mockResolvedValue({
        data: null,
        error: "Unauthorized",
        isAuthError: true,
      });

      await useDashboardStore.getState().loadSummary();

      const state = useDashboardStore.getState();
      expect(state.isAuthError).toBe(true);
      expect(state.error).toBe("Unauthorized");
    });

    it("should set isLoading to true before API call", async () => {
      let resolvePromise!: (value: unknown) => void;
      vi.mocked(loadClientDashboard).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }) as never,
      );

      const promise = useDashboardStore.getState().loadSummary();
      expect(useDashboardStore.getState().isLoading).toBe(true);

      resolvePromise({ data: null, error: null, isAuthError: false });
      await promise;

      expect(useDashboardStore.getState().isLoading).toBe(false);
    });
  });

  describe("setSelectedDetailEntry", () => {
    it("should update selectedDetailEntry", () => {
      const entry = { id: 1, name: "Test" } as never;

      useDashboardStore.getState().setSelectedDetailEntry(entry);

      expect(useDashboardStore.getState().selectedDetailEntry).toEqual(entry);
    });

    it("should clear selectedDetailEntry with null", () => {
      useDashboardStore.setState({ selectedDetailEntry: { id: 1 } as never });

      useDashboardStore.getState().setSelectedDetailEntry(null);

      expect(useDashboardStore.getState().selectedDetailEntry).toBeNull();
    });
  });

  describe("setEditEntry", () => {
    it("should update editEntry", () => {
      const entry = { id: 2, service: "Clean" } as never;

      useDashboardStore.getState().setEditEntry(entry);

      expect(useDashboardStore.getState().editEntry).toEqual(entry);
    });
  });

  describe("setServiceHistoryFilter", () => {
    it("should update the filter value", () => {
      useDashboardStore.getState().setServiceHistoryFilter("all");

      expect(useDashboardStore.getState().serviceHistoryFilter).toBe("all");
    });
  });

  describe("setSidePanelRecurrenceType", () => {
    it("should update recurrence type", () => {
      useDashboardStore.getState().setSidePanelRecurrenceType("weekly");

      expect(useDashboardStore.getState().sidePanelRecurrenceType).toBe("weekly");
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useDashboardStore.setState({
        summary: mockSummary as never,
        isLoading: true,
        error: "error",
        isAuthError: true,
        selectedDetailEntry: { id: 1 } as never,
        editEntry: { id: 2 } as never,
        serviceHistoryFilter: "all",
        sidePanelRecurrenceType: "weekly",
      });

      useDashboardStore.getState().reset();

      const state = useDashboardStore.getState();
      expect(state.summary).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthError).toBe(false);
      expect(state.selectedDetailEntry).toBeNull();
      expect(state.editEntry).toBeNull();
      expect(state.serviceHistoryFilter).toBe("recent");
      expect(state.sidePanelRecurrenceType).toBe("monthly");
    });
  });
});
