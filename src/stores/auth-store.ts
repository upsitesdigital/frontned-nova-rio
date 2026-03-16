import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configureAuthProvider } from "@/api/http-client";
import type { UserType } from "@/api/auth-api";
import { appConfig } from "@/config/app";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userType: UserType | null;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string, userType: UserType) => void;
  setAccessToken: (token: string) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userType: null,
};

const AUTH_COOKIE_NAME = appConfig.authCookieName;

function syncAuthCookie(state: AuthState): void {
  if (typeof document === "undefined") return;

  if (state.accessToken) {
    const cookieValue = JSON.stringify({
      state: {
        userType: state.userType,
      },
    });
    const secure = window.location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(cookieValue)};path=/;SameSite=Lax${secure}`;
  } else {
    document.cookie = `${AUTH_COOKIE_NAME}=;path=/;max-age=0`;
  }
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: (accessToken, refreshToken, userType) => {
        const next = { accessToken, refreshToken, userType };
        syncAuthCookie(next);
        set(next);
      },

      setAccessToken: (token) => {
        set((prev) => {
          const next = { ...prev, accessToken: token };
          syncAuthCookie(next);
          return { accessToken: token };
        });
      },

      reset: () => {
        syncAuthCookie(initialState);
        set(initialState);
      },
    }),
    {
      name: AUTH_COOKIE_NAME,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userType: state.userType,
      }),
    },
  ),
);

function waitForAuthHydration(): Promise<void> {
  return new Promise((resolve) => {
    if (useAuthStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

configureAuthProvider({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (accessToken, refreshToken) => {
    const currentType = useAuthStore.getState().userType ?? "client";
    useAuthStore.getState().setTokens(accessToken, refreshToken, currentType);
  },
  reset: () => useAuthStore.getState().reset(),
});

export { useAuthStore, waitForAuthHydration, type AuthStore };
