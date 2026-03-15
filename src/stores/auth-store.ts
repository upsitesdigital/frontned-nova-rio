import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configureAuthProvider } from "@/api/http-client";
import type { UserType } from "@/api/auth-api";

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

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: (accessToken, refreshToken, userType) =>
        set({ accessToken, refreshToken, userType }),

      setAccessToken: (token) => set({ accessToken: token }),

      reset: () => set(initialState),
    }),
    {
      name: "nova-rio-auth",
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
