import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configureAuthProvider } from "@/api/http-client";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

      setAccessToken: (token) => set({ accessToken: token }),

      reset: () => set(initialState),
    }),
    {
      name: "nova-rio-auth",
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
  setTokens: (accessToken, refreshToken) => useAuthStore.getState().setTokens(accessToken, refreshToken),
  reset: () => useAuthStore.getState().reset(),
});

export { useAuthStore, waitForAuthHydration, type AuthStore };
