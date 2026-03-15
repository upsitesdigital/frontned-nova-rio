import { create } from "zustand";

import { loginClient } from "@/api/auth-api";
import { HttpClientError } from "@/api/http-client";
import { MESSAGES } from "@/lib/messages";
import { useAuthStore } from "@/stores/auth-store";
import { validateLoginInput } from "@/validation/login-schema";

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

    const validationError = validateLoginInput({ email, password });
    if (validationError) {
      set({ error: validationError });
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
            ? MESSAGES.auth.wrongCredentials
            : error.message
          : MESSAGES.auth.loginError;

      set({ isSubmitting: false, error: message });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useLoginStore, type LoginStore };
