import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HttpClient } from "@/api/core/http-client";
import type { UserType } from "@/api/core/auth-api";
import { AppConfig } from "@/config/app";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userType: UserType | null;
  authEpoch: number;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string, userType: UserType) => void;
  setAccessToken: (token: string) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;
type AuthBroadcastMessage =
  | { type: "tokens"; accessToken: string; refreshToken: string; userType: UserType }
  | { type: "reset" };

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userType: null,
  authEpoch: 0,
};

const authCookieName = AppConfig.authCookieName;
const authChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("nova-rio-auth")
    : null;
let isApplyingRemoteAuthMessage = false;

function syncAuthCookie(state: AuthState): void {
  if (typeof document === "undefined") return;

  if (state.accessToken) {
    const cookieValue = JSON.stringify({
      state: {
        userType: state.userType,
      },
    });
    const secure = window.location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `${authCookieName}=${encodeURIComponent(cookieValue)};path=/;SameSite=Lax${secure}`;
  } else {
    document.cookie = `${authCookieName}=;path=/;max-age=0`;
  }
}

function broadcastAuthMessage(message: AuthBroadcastMessage): void {
  if (isApplyingRemoteAuthMessage) return;
  authChannel?.postMessage(message);
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: (accessToken, refreshToken, userType) => {
        const next = {
          accessToken,
          refreshToken,
          userType,
          authEpoch: useAuthStore.getState().authEpoch,
        };
        syncAuthCookie(next);
        set(next);
        broadcastAuthMessage({ type: "tokens", accessToken, refreshToken, userType });
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
        set((state) => ({ ...initialState, authEpoch: state.authEpoch + 1 }));
        broadcastAuthMessage({ type: "reset" });
      },
    }),
    {
      name: authCookieName,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userType: state.userType,
        authEpoch: state.authEpoch,
      }),
    },
  ),
);

authChannel?.addEventListener("message", (event: MessageEvent<AuthBroadcastMessage>) => {
  isApplyingRemoteAuthMessage = true;
  try {
    if (event.data.type === "reset") {
      useAuthStore.getState().reset();
      return;
    }

    useAuthStore
      .getState()
      .setTokens(event.data.accessToken, event.data.refreshToken, event.data.userType);
  } finally {
    isApplyingRemoteAuthMessage = false;
  }
});

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

HttpClient.configureAuthProvider({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  getAuthEpoch: () => useAuthStore.getState().authEpoch,
  setTokens: (accessToken, refreshToken) => {
    const currentType = useAuthStore.getState().userType ?? "client";
    useAuthStore.getState().setTokens(accessToken, refreshToken, currentType);
  },
  reset: () => useAuthStore.getState().reset(),
});

export { useAuthStore, waitForAuthHydration, type AuthStore };
