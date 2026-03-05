import { create } from "zustand";

import { loginClient } from "@/api/auth-api";
import { HttpClientError } from "@/api/http-client";
import { useAuthStore } from "@/stores/auth-store";

interface LoginState {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
}

interface LoginActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  submit: () => Promise<boolean>;
  reset: () => void;
}

type LoginStore = LoginState & LoginActions;

const initialState: LoginState = {
  email: "",
  password: "",
  isSubmitting: false,
  error: null,
};

const useLoginStore = create<LoginStore>()((set) => ({
  ...initialState,

  setEmail: (email) => set({ email, error: null }),
  setPassword: (password) => set({ password, error: null }),

  submit: async () => {
    const { email, password } = useLoginStore.getState();

    if (!email.trim() || !password.trim()) {
      set({ error: "Preencha todos os campos." });
      return false;
    }

    set({ isSubmitting: true, error: null });

    try {
      const tokens = await loginClient({ email, password });
      useAuthStore.getState().setAccessToken(tokens.accessToken);
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      const message =
        error instanceof HttpClientError
          ? error.status === 401
            ? "E-mail ou senha incorretos."
            : error.message
          : "Erro ao entrar. Tente novamente.";

      set({ isSubmitting: false, error: message });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useLoginStore, type LoginStore };
