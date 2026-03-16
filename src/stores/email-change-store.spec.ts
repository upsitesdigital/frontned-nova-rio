import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/profile-api", () => ({
  requestEmailChange: vi.fn(),
  verifyEmailChange: vi.fn(),
  fetchClientProfile: vi.fn(),
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
    auth: { invalidEmail: "Formato de e-mail invalido." },
    email: {
      requestError: "Erro ao solicitar alteracao de e-mail.",
      verifyError: "Erro ao verificar codigo.",
      changed: "E-mail alterado!",
    },
  },
}));

vi.mock("@/validation/email-schema", () => ({
  isValidEmail: vi.fn(),
}));

vi.mock("@/stores/toast-store", () => {
  const showToast = vi.fn();
  return {
    useToastStore: { getState: () => ({ showToast }) },
  };
});

vi.mock("@/stores/profile-info-store", () => {
  const setProfile = vi.fn();
  return {
    useProfileInfoStore: { getState: () => ({ setProfile }) },
  };
});

const { requestEmailChange, verifyEmailChange, fetchClientProfile } =
  await import("@/api/profile-api");
const { isValidEmail } = await import("@/validation/email-schema");
const { useToastStore } = await import("@/stores/toast-store");
const { useProfileInfoStore } = await import("@/stores/profile-info-store");

import { useEmailChangeStore } from "./email-change-store";

describe("EmailChangeStore", () => {
  beforeEach(() => {
    useEmailChangeStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useEmailChangeStore.getState();

      expect(state.emailDialogOpen).toBe(false);
      expect(state.emailChangeStep).toBe("email");
      expect(state.newEmail).toBe("");
      expect(state.emailCode).toBe("");
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("openEmailDialog", () => {
    it("should open dialog and clear error", () => {
      useEmailChangeStore.setState({ error: "old error" });

      useEmailChangeStore.getState().openEmailDialog();

      const state = useEmailChangeStore.getState();
      expect(state.emailDialogOpen).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe("closeEmailDialog", () => {
    it("should close dialog and reset fields", () => {
      useEmailChangeStore.setState({
        emailDialogOpen: true,
        emailChangeStep: "code",
        newEmail: "new@test.com",
        emailCode: "123456",
        error: "error",
      });

      useEmailChangeStore.getState().closeEmailDialog();

      const state = useEmailChangeStore.getState();
      expect(state.emailDialogOpen).toBe(false);
      expect(state.emailChangeStep).toBe("email");
      expect(state.newEmail).toBe("");
      expect(state.emailCode).toBe("");
      expect(state.error).toBeNull();
    });
  });

  describe("setNewEmail / setEmailCode", () => {
    it("should update newEmail", () => {
      useEmailChangeStore.getState().setNewEmail("test@test.com");
      expect(useEmailChangeStore.getState().newEmail).toBe("test@test.com");
    });

    it("should update emailCode", () => {
      useEmailChangeStore.getState().setEmailCode("654321");
      expect(useEmailChangeStore.getState().emailCode).toBe("654321");
    });
  });

  describe("submitEmailChange", () => {
    it("should return false and set error for invalid email", async () => {
      vi.mocked(isValidEmail).mockReturnValue(false);
      useEmailChangeStore.setState({ newEmail: "bad-email" });

      const result = await useEmailChangeStore.getState().submitEmailChange();

      expect(result).toBe(false);
      expect(useEmailChangeStore.getState().error).toBe("Formato de e-mail invalido.");
      expect(requestEmailChange).not.toHaveBeenCalled();
    });

    it("should advance to code step on success", async () => {
      vi.mocked(isValidEmail).mockReturnValue(true);
      vi.mocked(requestEmailChange).mockResolvedValue(undefined as never);
      useEmailChangeStore.setState({ newEmail: "valid@test.com" });

      const result = await useEmailChangeStore.getState().submitEmailChange();

      expect(result).toBe(true);
      const state = useEmailChangeStore.getState();
      expect(state.emailChangeStep).toBe("code");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on API failure", async () => {
      vi.mocked(isValidEmail).mockReturnValue(true);
      vi.mocked(requestEmailChange).mockRejectedValue(new Error("Network"));
      useEmailChangeStore.setState({ newEmail: "valid@test.com" });

      const result = await useEmailChangeStore.getState().submitEmailChange();

      expect(result).toBe(false);
      expect(useEmailChangeStore.getState().error).toBe("Erro ao solicitar alteracao de e-mail.");
      expect(useEmailChangeStore.getState().isSaving).toBe(false);
    });
  });

  describe("submitEmailVerification", () => {
    it("should verify code, reload profile, and close dialog on success", async () => {
      const mockProfile = { id: 1, name: "Test", email: "new@test.com" };
      vi.mocked(verifyEmailChange).mockResolvedValue(undefined as never);
      vi.mocked(fetchClientProfile).mockResolvedValue(mockProfile as never);
      useEmailChangeStore.setState({ emailCode: "123456", newEmail: "new@test.com" });

      const result = await useEmailChangeStore.getState().submitEmailVerification();

      expect(result).toBe(true);
      expect(verifyEmailChange).toHaveBeenCalledWith("123456", "new@test.com");
      expect(fetchClientProfile).toHaveBeenCalled();
      expect(useProfileInfoStore.getState().setProfile).toHaveBeenCalledWith(mockProfile);
      expect(useToastStore.getState().showToast).toHaveBeenCalledWith("E-mail alterado!");
      const state = useEmailChangeStore.getState();
      expect(state.emailDialogOpen).toBe(false);
      expect(state.emailChangeStep).toBe("email");
      expect(state.newEmail).toBe("");
      expect(state.emailCode).toBe("");
    });

    it("should set error on API failure", async () => {
      vi.mocked(verifyEmailChange).mockRejectedValue(new Error("Bad code"));
      useEmailChangeStore.setState({ emailCode: "wrong", newEmail: "test@test.com" });

      const result = await useEmailChangeStore.getState().submitEmailVerification();

      expect(result).toBe(false);
      expect(useEmailChangeStore.getState().error).toBe("Erro ao verificar codigo.");
      expect(useEmailChangeStore.getState().isSaving).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useEmailChangeStore.setState({
        emailDialogOpen: true,
        emailChangeStep: "code",
        newEmail: "test@test.com",
        emailCode: "123456",
        isSaving: true,
        error: "error",
      });

      useEmailChangeStore.getState().reset();

      const state = useEmailChangeStore.getState();
      expect(state.emailDialogOpen).toBe(false);
      expect(state.emailChangeStep).toBe("email");
      expect(state.newEmail).toBe("");
      expect(state.emailCode).toBe("");
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
