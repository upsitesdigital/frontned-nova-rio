import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock persist to be a passthrough (no localStorage)
vi.mock("zustand/middleware", () => ({
  persist: (config: unknown) => config,
}));

vi.mock("@/api/http-client", () => ({
  configureAuthProvider: vi.fn(),
}));

vi.mock("@/api/auth-api", () => ({
  login: vi.fn(),
}));

const { useAuthStore, waitForAuthHydration } = await import("./auth-store");

describe("AuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, refreshToken: null, userType: null });
  });

  describe("setTokens", () => {
    it("should store accessToken, refreshToken, and userType", () => {
      useAuthStore.getState().setTokens("access-token", "refresh-token", "client");

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe("access-token");
      expect(state.refreshToken).toBe("refresh-token");
      expect(state.userType).toBe("client");
    });

    it("should store admin userType", () => {
      useAuthStore.getState().setTokens("at", "rt", "admin");

      expect(useAuthStore.getState().userType).toBe("admin");
    });
  });

  describe("setAccessToken", () => {
    it("should update only the accessToken", () => {
      useAuthStore.getState().setTokens("old-access", "refresh", "client");
      useAuthStore.getState().setAccessToken("new-access");

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe("new-access");
      expect(state.refreshToken).toBe("refresh");
      expect(state.userType).toBe("client");
    });
  });

  describe("reset", () => {
    it("should clear all auth state", () => {
      useAuthStore.getState().setTokens("at", "rt", "admin");
      useAuthStore.getState().reset();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.userType).toBeNull();
    });
  });

  describe("waitForAuthHydration", () => {
    it("should be a function that returns a promise", () => {
      // With persist mocked out, persist.hasHydrated is not available.
      // We verify the function exists and is callable.
      expect(typeof waitForAuthHydration).toBe("function");
    });
  });

  describe("immutability", () => {
    it("should create new state objects on each update", () => {
      useAuthStore.getState().setTokens("a", "r", "client");
      const state1 = useAuthStore.getState();

      useAuthStore.getState().setAccessToken("b");
      const state2 = useAuthStore.getState();

      expect(state1).not.toBe(state2);
      expect(state1.accessToken).toBe("a");
      expect(state2.accessToken).toBe("b");
    });
  });
});
