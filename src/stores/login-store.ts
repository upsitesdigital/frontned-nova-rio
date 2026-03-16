import { create } from "zustand";

import { MESSAGES } from "@/lib/messages";
import { useAuthStore } from "@/stores/auth-store";
import { authenticateUser } from "@/use-cases/authenticate-user";
import { validateLoginInput } from "@/validation/login-schema";

import type { UserType } from "@/api/auth-api";

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
  submit: () => Promise<UserType | null>;
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
      return null;
    }

    set({ isSubmitting: true, error: null });

    const result = await authenticateUser(email, password);

    switch (result.type) {
      case "success": {
        useAuthStore.getState().setTokens(result.accessToken, result.refreshToken, result.userType);
        set({ isSubmitting: false });
        return result.userType;
      }
      case "pending": {
        set({ isSubmitting: false, pendingApproval: true });
        return null;
      }
      case "invalidCredentials": {
        set({ isSubmitting: false, error: MESSAGES.auth.wrongCredentials });
        return null;
      }
      case "error": {
        set({ isSubmitting: false, error: result.message });
        return null;
      }
    }
  },

  reset: () => set(initialState),
}));

export { useLoginStore, type LoginStore };
