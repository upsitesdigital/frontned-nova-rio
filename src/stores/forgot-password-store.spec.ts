import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    password: {
      mismatch: "As senhas nao coincidem.",
      fillEmail: "Preencha o campo de e-mail.",
    },
  },
}));

vi.mock("@/use-cases/request-password-reset", () => ({
  requestPasswordResetCode: vi.fn(),
}));

vi.mock("@/use-cases/reset-user-password", () => ({
  resetUserPassword: vi.fn(),
}));

vi.mock("@/validation/reset-password-schema", () => ({
  getPasswordHints: vi.fn(),
  validateResetPassword: vi.fn(),
}));

const { requestPasswordResetCode } = await import("@/use-cases/request-password-reset");
const { resetUserPassword } = await import("@/use-cases/reset-user-password");
const { getPasswordHints, validateResetPassword } = await import(
  "@/validation/reset-password-schema"
);
const { useForgotPasswordStore } = await import("./forgot-password-store");

describe("ForgotPasswordStore", () => {
  beforeEach(() => {
    useForgotPasswordStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(validateResetPassword).mockReturnValue({});
    vi.mocked(getPasswordHints).mockReturnValue([]);
  });

  describe("initial state", () => {
    it("should have default values", () => {
      const state = useForgotPasswordStore.getState();

      expect(state.step).toBe("email");
      expect(state.email).toBe("");
      expect(state.code).toBe("");
      expect(state.newPassword).toBe("");
      expect(state.confirmPassword).toBe("");
      expect(state.isSubmitting).toBe(false);
      expect(state.error).toBeNull();
      expect(state.fieldErrors).toEqual({});
      expect(state.passwordHints).toEqual([]);
    });
  });

  describe("setEmail", () => {
    it("should update email and clear error", () => {
      useForgotPasswordStore.setState({ error: "some error" });

      useForgotPasswordStore.getState().setEmail("user@test.com");

      expect(useForgotPasswordStore.getState().email).toBe("user@test.com");
      expect(useForgotPasswordStore.getState().error).toBeNull();
    });
  });

  describe("setCode", () => {
    it("should keep only digits and limit to 6", () => {
      useForgotPasswordStore.getState().setCode("12ab34cd56ef78");

      expect(useForgotPasswordStore.getState().code).toBe("123456");
    });

    it("should clear error and fieldErrors", () => {
      useForgotPasswordStore.setState({
        error: "err",
        fieldErrors: { code: "invalid" },
      });

      useForgotPasswordStore.getState().setCode("123");

      expect(useForgotPasswordStore.getState().error).toBeNull();
      expect(useForgotPasswordStore.getState().fieldErrors).toEqual({});
    });
  });

  describe("setNewPassword", () => {
    it("should update password and call getPasswordHints", () => {
      const hints = [{ label: "8 chars", met: true }];
      vi.mocked(getPasswordHints).mockReturnValue(hints);

      useForgotPasswordStore.getState().setNewPassword("Str0ng@P");

      expect(useForgotPasswordStore.getState().newPassword).toBe("Str0ng@P");
      expect(getPasswordHints).toHaveBeenCalledWith("Str0ng@P");
      expect(useForgotPasswordStore.getState().passwordHints).toEqual(hints);
    });

    it("should return empty hints when password is empty", () => {
      useForgotPasswordStore.getState().setNewPassword("");

      expect(getPasswordHints).not.toHaveBeenCalled();
      expect(useForgotPasswordStore.getState().passwordHints).toEqual([]);
    });

    it("should set confirmPassword mismatch error when passwords differ", () => {
      useForgotPasswordStore.setState({ confirmPassword: "Other@123" });

      useForgotPasswordStore.getState().setNewPassword("Str0ng@P");

      expect(useForgotPasswordStore.getState().fieldErrors).toEqual({
        confirmPassword: "As senhas nao coincidem.",
      });
    });

    it("should clear fieldErrors when passwords match", () => {
      useForgotPasswordStore.setState({ confirmPassword: "Str0ng@P" });

      useForgotPasswordStore.getState().setNewPassword("Str0ng@P");

      expect(useForgotPasswordStore.getState().fieldErrors).toEqual({});
    });
  });

  describe("setConfirmPassword", () => {
    it("should set mismatch error when passwords differ", () => {
      useForgotPasswordStore.setState({ newPassword: "Str0ng@P" });

      useForgotPasswordStore.getState().setConfirmPassword("Diff@123");

      expect(useForgotPasswordStore.getState().fieldErrors).toEqual({
        confirmPassword: "As senhas nao coincidem.",
      });
    });

    it("should clear fieldErrors when passwords match", () => {
      useForgotPasswordStore.setState({ newPassword: "Str0ng@P" });

      useForgotPasswordStore.getState().setConfirmPassword("Str0ng@P");

      expect(useForgotPasswordStore.getState().fieldErrors).toEqual({});
    });

    it("should not set error when confirmPassword is empty", () => {
      useForgotPasswordStore.setState({ newPassword: "Str0ng@P" });

      useForgotPasswordStore.getState().setConfirmPassword("");

      expect(useForgotPasswordStore.getState().fieldErrors).toEqual({});
    });
  });

  describe("submitEmailStep", () => {
    it("should return false and set error when email is empty", async () => {
      useForgotPasswordStore.setState({ email: "  " });

      const result = await useForgotPasswordStore.getState().submitEmailStep();

      expect(result).toBe(false);
      expect(useForgotPasswordStore.getState().error).toBe("Preencha o campo de e-mail.");
      expect(requestPasswordResetCode).not.toHaveBeenCalled();
    });

    it("should advance to code step on success", async () => {
      useForgotPasswordStore.setState({ email: "user@test.com" });
      vi.mocked(requestPasswordResetCode).mockResolvedValue({
        success: true,
        error: null,
      });

      const result = await useForgotPasswordStore.getState().submitEmailStep();

      expect(result).toBe(true);
      expect(useForgotPasswordStore.getState().step).toBe("code");
      expect(useForgotPasswordStore.getState().isSubmitting).toBe(false);
    });

    it("should set error on failure", async () => {
      useForgotPasswordStore.setState({ email: "user@test.com" });
      vi.mocked(requestPasswordResetCode).mockResolvedValue({
        success: false,
        error: "Erro ao enviar codigo.",
      });

      const result = await useForgotPasswordStore.getState().submitEmailStep();

      expect(result).toBe(false);
      expect(useForgotPasswordStore.getState().error).toBe("Erro ao enviar codigo.");
      expect(useForgotPasswordStore.getState().isSubmitting).toBe(false);
    });

    it("should set isSubmitting during API call", async () => {
      useForgotPasswordStore.setState({ email: "user@test.com" });

      let resolveRequest!: (
        value: { success: boolean; error: string | null },
      ) => void;
      vi.mocked(requestPasswordResetCode).mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
      );

      const submitPromise = useForgotPasswordStore.getState().submitEmailStep();

      expect(useForgotPasswordStore.getState().isSubmitting).toBe(true);

      resolveRequest({ success: true, error: null });
      await submitPromise;

      expect(useForgotPasswordStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("submitCodeStep", () => {
    it("should return false and set fieldErrors on validation failure", async () => {
      const errors = { code: "O codigo deve ter 6 digitos" };
      vi.mocked(validateResetPassword).mockReturnValue(errors);

      const result = await useForgotPasswordStore.getState().submitCodeStep();

      expect(result).toBe(false);
      expect(useForgotPasswordStore.getState().fieldErrors).toEqual(errors);
      expect(resetUserPassword).not.toHaveBeenCalled();
    });

    it("should advance to success step on success", async () => {
      useForgotPasswordStore.setState({
        email: "user@test.com",
        code: "123456",
        newPassword: "Str0ng@P",
        confirmPassword: "Str0ng@P",
      });
      vi.mocked(resetUserPassword).mockResolvedValue({
        success: true,
        error: null,
      });

      const result = await useForgotPasswordStore.getState().submitCodeStep();

      expect(result).toBe(true);
      expect(useForgotPasswordStore.getState().step).toBe("success");
      expect(resetUserPassword).toHaveBeenCalledWith("user@test.com", "123456", "Str0ng@P");
    });

    it("should set error on API failure", async () => {
      useForgotPasswordStore.setState({
        email: "user@test.com",
        code: "123456",
        newPassword: "Str0ng@P",
        confirmPassword: "Str0ng@P",
      });
      vi.mocked(resetUserPassword).mockResolvedValue({
        success: false,
        error: "Codigo invalido.",
      });

      const result = await useForgotPasswordStore.getState().submitCodeStep();

      expect(result).toBe(false);
      expect(useForgotPasswordStore.getState().error).toBe("Codigo invalido.");
      expect(useForgotPasswordStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useForgotPasswordStore.setState({
        step: "code",
        email: "user@test.com",
        code: "123456",
        newPassword: "pass",
        confirmPassword: "pass",
        isSubmitting: true,
        error: "err",
        fieldErrors: { code: "invalid" },
        passwordHints: [{ label: "hint", met: true }],
      });

      useForgotPasswordStore.getState().reset();

      const state = useForgotPasswordStore.getState();
      expect(state.step).toBe("email");
      expect(state.email).toBe("");
      expect(state.code).toBe("");
      expect(state.isSubmitting).toBe(false);
      expect(state.error).toBeNull();
      expect(state.fieldErrors).toEqual({});
      expect(state.passwordHints).toEqual([]);
    });
  });
});
