import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export { useAuthStore, type AuthStore };
