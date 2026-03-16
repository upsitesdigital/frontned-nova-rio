import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/auth-api", () => ({
  login: vi.fn(),
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

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    auth: {
      fillAllFields: "Preencha todos os campos.",
      invalidEmail: "Formato de e-mail inválido.",
      wrongCredentials: "E-mail ou senha incorretos.",
      loginError: "Erro ao entrar. Tente novamente.",
      pendingApproval: "Seu cadastro está em análise.",
    },
  },
}));

vi.mock("@/validation/login-schema", () => ({
  validateLoginInput: vi.fn(),
}));

vi.mock("@/stores/auth-store", () => {
  const setTokens = vi.fn();
  return {
    useAuthStore: {
      getState: () => ({ setTokens }),
    },
  };
});

const authApi = await import("@/api/auth-api");
const { HttpClientError } = await import("@/api/http-client");
const { validateLoginInput } = await import("@/validation/login-schema");
const { useAuthStore } = await import("@/stores/auth-store");

import { useLoginStore } from "./login-store";

describe("LoginStore", () => {
  beforeEach(() => {
    useLoginStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(validateLoginInput).mockReturnValue(null);
  });

  describe("setEmail / setPassword", () => {
    it("should update email and clear error", () => {
      useLoginStore.setState({ error: "some error" });

      useLoginStore.getState().setEmail("test@example.com");

      const state = useLoginStore.getState();
      expect(state.email).toBe("test@example.com");
      expect(state.error).toBeNull();
    });

    it("should update password and clear error", () => {
      useLoginStore.setState({ error: "some error" });

      useLoginStore.getState().setPassword("Str0ng@Pass");

      const state = useLoginStore.getState();
      expect(state.password).toBe("Str0ng@Pass");
      expect(state.error).toBeNull();
    });

    it("should clear pendingApproval on input change", () => {
      useLoginStore.setState({ pendingApproval: true });

      useLoginStore.getState().setEmail("new@email.com");

      expect(useLoginStore.getState().pendingApproval).toBe(false);
    });
  });

  describe("submit", () => {
    it("should return null and set error on validation failure", async () => {
      vi.mocked(validateLoginInput).mockReturnValue("Preencha todos os campos.");
      useLoginStore.setState({ email: "", password: "" });

      const result = await useLoginStore.getState().submit();

      expect(result).toBeNull();
      expect(useLoginStore.getState().error).toBe("Preencha todos os campos.");
      expect(authApi.login).not.toHaveBeenCalled();
    });

    it("should call login API and set auth tokens on success", async () => {
      useLoginStore.setState({ email: "test@example.com", password: "Str0ng@Pass" });
      vi.mocked(authApi.login).mockResolvedValue({
        accessToken: "access",
        refreshToken: "refresh",
        userType: "client",
      });

      const result = await useLoginStore.getState().submit();

      expect(result).toBe("client");
      expect(authApi.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Str0ng@Pass",
      });
      expect(useAuthStore.getState().setTokens).toHaveBeenCalledWith("access", "refresh", "client");
      expect(useLoginStore.getState().isSubmitting).toBe(false);
    });

    it("should return admin userType on admin login", async () => {
      useLoginStore.setState({ email: "admin@test.com", password: "Admin@2026!" });
      vi.mocked(authApi.login).mockResolvedValue({
        accessToken: "access",
        refreshToken: "refresh",
        userType: "admin",
      });

      const result = await useLoginStore.getState().submit();

      expect(result).toBe("admin");
    });

    it("should set pendingApproval on 403", async () => {
      useLoginStore.setState({ email: "pending@test.com", password: "Str0ng@Pass" });
      vi.mocked(authApi.login).mockRejectedValue(new HttpClientError(403, "Pending"));

      const result = await useLoginStore.getState().submit();

      expect(result).toBeNull();
      expect(useLoginStore.getState().pendingApproval).toBe(true);
      expect(useLoginStore.getState().error).toBeNull();
      expect(useLoginStore.getState().isSubmitting).toBe(false);
    });

    it("should set wrongCredentials error on 401", async () => {
      useLoginStore.setState({ email: "wrong@test.com", password: "Str0ng@Pass" });
      vi.mocked(authApi.login).mockRejectedValue(new HttpClientError(401, "Invalid credentials"));

      const result = await useLoginStore.getState().submit();

      expect(result).toBeNull();
      expect(useLoginStore.getState().error).toBe("E-mail ou senha incorretos.");
    });

    it("should set generic error on non-HTTP error", async () => {
      useLoginStore.setState({ email: "test@test.com", password: "Str0ng@Pass" });
      vi.mocked(authApi.login).mockRejectedValue(new Error("Network error"));

      const result = await useLoginStore.getState().submit();

      expect(result).toBeNull();
      expect(useLoginStore.getState().error).toBe("Erro ao entrar. Tente novamente.");
    });

    it("should set server error message on 500", async () => {
      useLoginStore.setState({ email: "test@test.com", password: "Str0ng@Pass" });
      vi.mocked(authApi.login).mockRejectedValue(new HttpClientError(500, "Internal server error"));

      const result = await useLoginStore.getState().submit();

      expect(result).toBeNull();
      expect(useLoginStore.getState().error).toBe("Internal server error");
    });

    it("should set isSubmitting during API call", async () => {
      useLoginStore.setState({ email: "test@test.com", password: "Str0ng@Pass" });

      let resolveLogin!: (value: {
        accessToken: string;
        refreshToken: string;
        userType: "client" | "admin";
      }) => void;
      vi.mocked(authApi.login).mockReturnValue(
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
      );

      const submitPromise = useLoginStore.getState().submit();

      expect(useLoginStore.getState().isSubmitting).toBe(true);

      resolveLogin({ accessToken: "a", refreshToken: "r", userType: "client" });
      await submitPromise;

      expect(useLoginStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("dismissPendingApproval", () => {
    it("should clear pendingApproval flag", () => {
      useLoginStore.setState({ pendingApproval: true });

      useLoginStore.getState().dismissPendingApproval();

      expect(useLoginStore.getState().pendingApproval).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useLoginStore.setState({
        email: "test@test.com",
        password: "pass",
        isSubmitting: true,
        error: "error",
        pendingApproval: true,
      });

      useLoginStore.getState().reset();

      const state = useLoginStore.getState();
      expect(state.email).toBe("");
      expect(state.password).toBe("");
      expect(state.isSubmitting).toBe(false);
      expect(state.error).toBeNull();
      expect(state.pendingApproval).toBe(false);
    });
  });
});
