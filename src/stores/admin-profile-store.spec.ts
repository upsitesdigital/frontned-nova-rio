import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminProfileStore } from "./admin-profile-store";

const mockProfile = {
  id: 1,
  name: "Admin",
  email: "admin@test.com",
  role: "ADMIN_MASTER",
  status: "ACTIVE",
  createdAt: "2026-01-01",
};

const mockDashboardData = {
  profile: mockProfile,
  todayAppointmentsCount: 5,
  activeClientsCount: 10,
  pendingServicesCount: 3,
  agendaItems: [
    {
      appointmentId: 1,
      clientName: "Client",
      serviceName: "Clean",
      startTime: "09:00",
      duration: 60,
      status: "CONFIRMED",
      date: "2026-03-15",
    },
  ],
  agendaTotal: 1,
  serviceOptions: [{ id: 1, name: "Limpeza" }],
};

vi.mock("@/use-cases/load-admin-dashboard", () => ({
  loadAdminDashboardData: vi.fn(),
}));

vi.mock("@/lib/auth-helpers", () => ({
  resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminDashboard: { loadError: "Failed to load dashboard" } },
}));

const { loadAdminDashboardData } = await import("@/use-cases/load-admin-dashboard");

function resetStore() {
  useAdminProfileStore.getState().reset();
}

describe("AdminProfileStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("loadDashboard", () => {
    it("should load profile and metrics on success", async () => {
      vi.mocked(loadAdminDashboardData).mockResolvedValue({
        data: mockDashboardData,
        error: null,
        isAuthError: false,
      });

      const data = await useAdminProfileStore.getState().loadDashboard();

      const state = useAdminProfileStore.getState();
      expect(state.profile).toEqual(mockProfile);
      expect(state.todayAppointmentsCount).toBe(5);
      expect(state.activeClientsCount).toBe(10);
      expect(state.pendingServicesCount).toBe(3);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(data).toEqual(mockDashboardData);
    });

    it("should set isAuthError when use case reports auth error", async () => {
      vi.mocked(loadAdminDashboardData).mockResolvedValue({
        data: null,
        error: "Unauthorized",
        isAuthError: true,
      });

      await useAdminProfileStore.getState().loadDashboard();

      const state = useAdminProfileStore.getState();
      expect(state.isAuthError).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Unauthorized");
    });

    it("should set error without auth flag for non-auth errors", async () => {
      vi.mocked(loadAdminDashboardData).mockResolvedValue({
        data: null,
        error: "Server error",
        isAuthError: false,
      });

      await useAdminProfileStore.getState().loadDashboard();

      const state = useAdminProfileStore.getState();
      expect(state.isAuthError).toBe(false);
      expect(state.error).toBe("Server error");
    });

    it("should skip reload when data is already loaded", async () => {
      vi.mocked(loadAdminDashboardData).mockResolvedValue({
        data: mockDashboardData,
        error: null,
        isAuthError: false,
      });

      await useAdminProfileStore.getState().loadDashboard();
      vi.clearAllMocks();

      await useAdminProfileStore.getState().loadDashboard();

      expect(loadAdminDashboardData).not.toHaveBeenCalled();
    });

    it("should handle unexpected exceptions", async () => {
      vi.mocked(loadAdminDashboardData).mockRejectedValue(new Error("network"));

      await useAdminProfileStore.getState().loadDashboard();

      const state = useAdminProfileStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Failed to load dashboard");
    });
  });

  describe("reset", () => {
    it("should restore initial state", async () => {
      vi.mocked(loadAdminDashboardData).mockResolvedValue({
        data: mockDashboardData,
        error: null,
        isAuthError: false,
      });

      await useAdminProfileStore.getState().loadDashboard();
      useAdminProfileStore.getState().reset();

      const state = useAdminProfileStore.getState();
      expect(state.profile).toBeNull();
      expect(state.todayAppointmentsCount).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthError).toBe(false);
    });
  });
});
