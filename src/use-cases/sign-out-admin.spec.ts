import { vi, describe, it, expect, beforeEach } from "vitest";

const resetAuth = vi.fn();
const resetAdminProfile = vi.fn();
const resetAdminAgenda = vi.fn();
const setCollapsed = vi.fn();
const resetToast = vi.fn();

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: { getState: () => ({ reset: resetAuth }) },
}));

vi.mock("@/stores/admin-profile-store", () => ({
  useAdminProfileStore: { getState: () => ({ reset: resetAdminProfile }) },
}));

vi.mock("@/stores/admin-agenda-store", () => ({
  useAdminAgendaStore: { getState: () => ({ reset: resetAdminAgenda }) },
}));

vi.mock("@/stores/sidebar-store", () => ({
  useSidebarStore: { getState: () => ({ setCollapsed }) },
}));

vi.mock("@/stores/toast-store", () => ({
  useToastStore: { getState: () => ({ reset: resetToast }) },
}));

const { signOutAdmin } = await import("./sign-out-admin");

describe("signOutAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reset the auth store", () => {
    signOutAdmin();

    expect(resetAuth).toHaveBeenCalledOnce();
  });

  it("should reset the admin profile store", () => {
    signOutAdmin();

    expect(resetAdminProfile).toHaveBeenCalledOnce();
  });

  it("should reset the admin agenda store", () => {
    signOutAdmin();

    expect(resetAdminAgenda).toHaveBeenCalledOnce();
  });

  it("should set sidebar collapsed to false", () => {
    signOutAdmin();

    expect(setCollapsed).toHaveBeenCalledWith(false);
  });

  it("should reset the toast store", () => {
    signOutAdmin();

    expect(resetToast).toHaveBeenCalledOnce();
  });

  it("should call all store resets when invoked", () => {
    signOutAdmin();

    expect(resetAuth).toHaveBeenCalledOnce();
    expect(resetAdminProfile).toHaveBeenCalledOnce();
    expect(resetAdminAgenda).toHaveBeenCalledOnce();
    expect(setCollapsed).toHaveBeenCalledWith(false);
    expect(resetToast).toHaveBeenCalledOnce();
  });
});
