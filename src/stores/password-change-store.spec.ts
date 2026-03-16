import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/profile-api", () => ({
  requestPasswordChange: vi.fn(),
  verifyPasswordChange: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
  HttpClientError: class HttpClientError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpClientError";
    }
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  resolveErrorMessage: vi.fn((_error: unknown, fallback: string) => fallback),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    password: {
      mismatch: "As senhas nao coincidem.",
      weak: "Senha fraca.",
      requestError: "Erro ao solicitar alteracao de senha.",
      verifyError: "Erro ao alterar senha.",
      changed: "Senha alterada!",
    },
  },
}));

vi.mock("@/validation/password-strength-schema", () => ({
  validatePasswordStrength: vi.fn(),
  validatePasswordMatch: vi.fn(),
}));

vi.mock("@/stores/toast-store", () => {
  const showToast = vi.fn();
  return {
    useToastStore: { getState: () => ({ showToast }) },
  };
});

const { requestPasswordChange, verifyPasswordChange } = await import("@/api/profile-api");
const { validatePasswordStrength, validatePasswordMatch } = await import(
  "@/validation/password-strength-schema"
);
const { useToastStore } = await import("@/stores/toast-store");

import { usePasswordChangeStore } from "./password-change-store";

describe("PasswordChangeStore", () => {
  beforeEach(() => {
    usePasswordChangeStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(validatePasswordMatch).mockReturnValue(null);
    vi.mocked(validatePasswordStrength).mockReturnValue(null);
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = usePasswordChangeStore.getState();

      expect(state.passwordDialogOpen).toBe(false);
      expect(state.passwordChangeStep).toBe("request");
      expect(state.passwordCode).toBe("");
      expect(state.newPassword).toBe("");
      expect(state.confirmPassword).toBe("");
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("openPasswordDialog", () => {
    it("should open dialog and clear error", () => {
      usePasswordChangeStore.setState({ error: "old error" });

      usePasswordChangeStore.getState().openPasswordDialog();

      const state = usePasswordChangeStore.getState();
      expect(state.passwordDialogOpen).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe("closePasswordDialog", () => {
    it("should close dialog and reset fields", () => {
      usePasswordChangeStore.setState({
        passwordDialogOpen: true,
        passwordChangeStep: "verify",
        passwordCode: "123456",
        newPassword: "Pass@123",
        confirmPassword: "Pass@123",
        error: "error",
      });

      usePasswordChangeStore.getState().closePasswordDialog();

      const state = usePasswordChangeStore.getState();
      expect(state.passwordDialogOpen).toBe(false);
      expect(state.passwordChangeStep).toBe("request");
      expect(state.passwordCode).toBe("");
      expect(state.newPassword).toBe("");
      expect(state.confirmPassword).toBe("");
      expect(state.error).toBeNull();
    });
  });

  describe("setPasswordCode / setNewPassword / setConfirmPassword", () => {
    it("should update passwordCode", () => {
      usePasswordChangeStore.getState().setPasswordCode("654321");
      expect(usePasswordChangeStore.getState().passwordCode).toBe("654321");
    });

    it("should update newPassword", () => {
      usePasswordChangeStore.getState().setNewPassword("NewPass@1");
      expect(usePasswordChangeStore.getState().newPassword).toBe("NewPass@1");
    });

    it("should update confirmPassword", () => {
      usePasswordChangeStore.getState().setConfirmPassword("NewPass@1");
      expect(usePasswordChangeStore.getState().confirmPassword).toBe("NewPass@1");
    });
  });

  describe("submitPasswordChange", () => {
    it("should advance to verify step on success", async () => {
      vi.mocked(requestPasswordChange).mockResolvedValue(undefined as never);

      const result = await usePasswordChangeStore.getState().submitPasswordChange();

      expect(result).toBe(true);
      const state = usePasswordChangeStore.getState();
      expect(state.passwordChangeStep).toBe("verify");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on API failure", async () => {
      vi.mocked(requestPasswordChange).mockRejectedValue(new Error("Network"));

      const result = await usePasswordChangeStore.getState().submitPasswordChange();

      expect(result).toBe(false);
      expect(usePasswordChangeStore.getState().error).toBe(
        "Erro ao solicitar alteracao de senha.",
      );
      expect(usePasswordChangeStore.getState().isSaving).toBe(false);
    });
  });

  describe("submitPasswordVerification", () => {
    it("should return false when passwords do not match", async () => {
      vi.mocked(validatePasswordMatch).mockReturnValue("As senhas nao coincidem.");
      usePasswordChangeStore.setState({
        newPassword: "Pass@123",
        confirmPassword: "Different@1",
        passwordCode: "123456",
      });

      const result = await usePasswordChangeStore.getState().submitPasswordVerification();

      expect(result).toBe(false);
      expect(usePasswordChangeStore.getState().error).toBe("As senhas nao coincidem.");
      expect(verifyPasswordChange).not.toHaveBeenCalled();
    });

    it("should return false when password is weak", async () => {
      vi.mocked(validatePasswordStrength).mockReturnValue("Senha fraca.");
      usePasswordChangeStore.setState({
        newPassword: "weak",
        confirmPassword: "weak",
        passwordCode: "123456",
      });

      const result = await usePasswordChangeStore.getState().submitPasswordVerification();

      expect(result).toBe(false);
      expect(usePasswordChangeStore.getState().error).toBe("Senha fraca.");
    });

    it("should verify password and close dialog on success", async () => {
      vi.mocked(verifyPasswordChange).mockResolvedValue(undefined as never);
      usePasswordChangeStore.setState({
        newPassword: "Strong@1",
        confirmPassword: "Strong@1",
        passwordCode: "123456",
      });

      const result = await usePasswordChangeStore.getState().submitPasswordVerification();

      expect(result).toBe(true);
      expect(verifyPasswordChange).toHaveBeenCalledWith("123456", "Strong@1");
      expect(useToastStore.getState().showToast).toHaveBeenCalledWith("Senha alterada!");
      const state = usePasswordChangeStore.getState();
      expect(state.passwordDialogOpen).toBe(false);
      expect(state.passwordChangeStep).toBe("request");
      expect(state.passwordCode).toBe("");
      expect(state.newPassword).toBe("");
      expect(state.confirmPassword).toBe("");
    });

    it("should set error on API failure", async () => {
      vi.mocked(verifyPasswordChange).mockRejectedValue(new Error("Bad code"));
      usePasswordChangeStore.setState({
        newPassword: "Strong@1",
        confirmPassword: "Strong@1",
        passwordCode: "wrong",
      });

      const result = await usePasswordChangeStore.getState().submitPasswordVerification();

      expect(result).toBe(false);
      expect(usePasswordChangeStore.getState().error).toBe("Erro ao alterar senha.");
      expect(usePasswordChangeStore.getState().isSaving).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      usePasswordChangeStore.setState({
        passwordDialogOpen: true,
        passwordChangeStep: "verify",
        passwordCode: "123",
        newPassword: "pass",
        confirmPassword: "pass",
        isSaving: true,
        error: "error",
      });

      usePasswordChangeStore.getState().reset();

      const state = usePasswordChangeStore.getState();
      expect(state.passwordDialogOpen).toBe(false);
      expect(state.passwordChangeStep).toBe("request");
      expect(state.passwordCode).toBe("");
      expect(state.newPassword).toBe("");
      expect(state.confirmPassword).toBe("");
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
