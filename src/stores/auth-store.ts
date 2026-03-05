import { create } from "zustand";

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

export { useAuthStore, type AuthStore };
