import { create } from "zustand";

import { loginClient } from "@/api/auth-api";
import { HttpClientError } from "@/api/http-client";
import { useAuthStore } from "@/stores/auth-store";

interface LoginState {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
  pendingApproval: boolean;
}

interface LoginActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  submit: () => Promise<boolean>;
  dismissPendingApproval: () => void;
  reset: () => void;
}

type LoginStore = LoginState & LoginActions;

const initialState: LoginState = {
  email: "",
  password: "",
  isSubmitting: false,
  error: null,
  pendingApproval: false,
};

const useLoginStore = create<LoginStore>()((set) => ({
  ...initialState,

  setEmail: (email) => set({ email, error: null, pendingApproval: false }),
  setPassword: (password) => set({ password, error: null, pendingApproval: false }),
  dismissPendingApproval: () => set({ pendingApproval: false }),

  submit: async () => {
    const { email, password } = useLoginStore.getState();

    if (!email.trim() || !password.trim()) {
      set({ error: "Preencha todos os campos." });
      return false;
    }

    set({ isSubmitting: true, error: null });

    try {
      const tokens = await loginClient({ email, password });
      useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      if (error instanceof HttpClientError && error.status === 403) {
        set({ isSubmitting: false, pendingApproval: true });
        return false;
      }

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
