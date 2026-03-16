import { create } from "zustand";
import { configureAuthProvider } from "@/api/http-client";

interface AuthState {
  accessToken: string | null;
}

interface AuthActions {
  setAccessToken: (token: string) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  accessToken: null,
};

const useAuthStore = create<AuthStore>()((set) => ({
  ...initialState,

  setAccessToken: (token) => set({ accessToken: token }),

  reset: () => set(initialState),
}));

function waitForAuthHydration(): Promise<void> {
  return Promise.resolve();
}

configureAuthProvider({
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  reset: () => useAuthStore.getState().reset(),
});

export { useAuthStore, waitForAuthHydration, type AuthStore };
