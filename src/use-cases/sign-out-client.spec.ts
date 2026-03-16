import { vi, describe, it, expect, beforeEach } from "vitest";

const resetAuth = vi.fn();
const resetDashboard = vi.fn();
const resetDashboardPayments = vi.fn();
const resetProfileInfo = vi.fn();
const resetCards = vi.fn();
const resetEmailChange = vi.fn();
const resetPasswordChange = vi.fn();
const resetDeleteAccount = vi.fn();
const resetServiceEdit = vi.fn();
const resetServicesHistory = vi.fn();
const resetSidePanelReschedule = vi.fn();
const setCollapsed = vi.fn();
const resetToast = vi.fn();
const setFilter = vi.fn();

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: { getState: () => ({ reset: resetAuth }) },
}));

vi.mock("@/stores/cards-store", () => ({
  useCardsStore: { getState: () => ({ reset: resetCards }) },
}));

vi.mock("@/stores/dashboard-store", () => ({
  useDashboardStore: { getState: () => ({ reset: resetDashboard }) },
}));

vi.mock("@/stores/dashboard-payments-store", () => ({
  useDashboardPaymentsStore: {
    getState: () => ({ reset: resetDashboardPayments }),
  },
}));

vi.mock("@/stores/delete-account-store", () => ({
  useDeleteAccountStore: { getState: () => ({ reset: resetDeleteAccount }) },
}));

vi.mock("@/stores/email-change-store", () => ({
  useEmailChangeStore: { getState: () => ({ reset: resetEmailChange }) },
}));

vi.mock("@/stores/password-change-store", () => ({
  usePasswordChangeStore: { getState: () => ({ reset: resetPasswordChange }) },
}));

vi.mock("@/stores/payments-page-store", () => ({
  usePaymentsPageStore: { getState: () => ({ setFilter }) },
}));

vi.mock("@/stores/profile-info-store", () => ({
  useProfileInfoStore: { getState: () => ({ reset: resetProfileInfo }) },
}));

vi.mock("@/stores/service-edit-store", () => ({
  useServiceEditStore: { getState: () => ({ reset: resetServiceEdit }) },
}));

vi.mock("@/stores/services-history-store", () => ({
  useServicesHistoryStore: {
    getState: () => ({ reset: resetServicesHistory }),
  },
}));

vi.mock("@/stores/side-panel-reschedule-store", () => ({
  useSidePanelRescheduleStore: {
    getState: () => ({ reset: resetSidePanelReschedule }),
  },
}));

vi.mock("@/stores/sidebar-store", () => ({
  useSidebarStore: { getState: () => ({ setCollapsed }) },
}));

vi.mock("@/stores/toast-store", () => ({
  useToastStore: { getState: () => ({ reset: resetToast }) },
}));

const { signOutClient } = await import("./sign-out-client");

describe("signOutClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reset the auth store", () => {
    signOutClient();

    expect(resetAuth).toHaveBeenCalledOnce();
  });

  it("should reset the dashboard store", () => {
    signOutClient();

    expect(resetDashboard).toHaveBeenCalledOnce();
  });

  it("should reset the dashboard payments store", () => {
    signOutClient();

    expect(resetDashboardPayments).toHaveBeenCalledOnce();
  });

  it("should reset the profile info store", () => {
    signOutClient();

    expect(resetProfileInfo).toHaveBeenCalledOnce();
  });

  it("should reset the cards store", () => {
    signOutClient();

    expect(resetCards).toHaveBeenCalledOnce();
  });

  it("should reset the email change store", () => {
    signOutClient();

    expect(resetEmailChange).toHaveBeenCalledOnce();
  });

  it("should reset the password change store", () => {
    signOutClient();

    expect(resetPasswordChange).toHaveBeenCalledOnce();
  });

  it("should reset the delete account store", () => {
    signOutClient();

    expect(resetDeleteAccount).toHaveBeenCalledOnce();
  });

  it("should reset the service edit store", () => {
    signOutClient();

    expect(resetServiceEdit).toHaveBeenCalledOnce();
  });

  it("should reset the services history store", () => {
    signOutClient();

    expect(resetServicesHistory).toHaveBeenCalledOnce();
  });

  it("should reset the side panel reschedule store", () => {
    signOutClient();

    expect(resetSidePanelReschedule).toHaveBeenCalledOnce();
  });

  it("should set sidebar collapsed to false", () => {
    signOutClient();

    expect(setCollapsed).toHaveBeenCalledWith(false);
  });

  it("should reset the toast store", () => {
    signOutClient();

    expect(resetToast).toHaveBeenCalledOnce();
  });

  it("should set payments page filter to ALL", () => {
    signOutClient();

    expect(setFilter).toHaveBeenCalledWith("ALL");
  });

  it("should call all store resets when invoked", () => {
    signOutClient();

    expect(resetAuth).toHaveBeenCalledOnce();
    expect(resetDashboard).toHaveBeenCalledOnce();
    expect(resetDashboardPayments).toHaveBeenCalledOnce();
    expect(resetProfileInfo).toHaveBeenCalledOnce();
    expect(resetCards).toHaveBeenCalledOnce();
    expect(resetEmailChange).toHaveBeenCalledOnce();
    expect(resetPasswordChange).toHaveBeenCalledOnce();
    expect(resetDeleteAccount).toHaveBeenCalledOnce();
    expect(resetServiceEdit).toHaveBeenCalledOnce();
    expect(resetServicesHistory).toHaveBeenCalledOnce();
    expect(resetSidePanelReschedule).toHaveBeenCalledOnce();
    expect(setCollapsed).toHaveBeenCalledWith(false);
    expect(resetToast).toHaveBeenCalledOnce();
    expect(setFilter).toHaveBeenCalledWith("ALL");
  });
});
