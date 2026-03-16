import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/auth-api", () => ({
  registerClient: vi.fn(),
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
    registration: {
      genericError: "Erro ao cadastrar. Tente novamente.",
    },
  },
}));

vi.mock("@/validation/create-account-schema", () => ({
  validateCreateAccount: vi.fn(),
  mapApiErrorToField: vi.fn(),
}));

const authApi = await import("@/api/auth-api");
const { HttpClientError } = await import("@/api/http-client");
const { validateCreateAccount, mapApiErrorToField } =
  await import("@/validation/create-account-schema");
const { useCreateAccountStore } = await import("./create-account-store");

describe("CreateAccountStore", () => {
  beforeEach(() => {
    useCreateAccountStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(validateCreateAccount).mockReturnValue({});
  });

  describe("initial state", () => {
    it("should have empty fields and no errors", () => {
      const state = useCreateAccountStore.getState();

      expect(state.name).toBe("");
      expect(state.email).toBe("");
      expect(state.phone).toBe("");
      expect(state.password).toBe("");
      expect(state.confirmPassword).toBe("");
      expect(state.isSubmitting).toBe(false);
      expect(state.errors).toEqual({});
    });
  });

  describe("setName", () => {
    it("should update name and clear errors", () => {
      useCreateAccountStore.setState({ errors: { name: "required" } });

      useCreateAccountStore.getState().setName("John");

      const state = useCreateAccountStore.getState();
      expect(state.name).toBe("John");
      expect(state.errors).toEqual({});
    });
  });

  describe("setEmail", () => {
    it("should update email and clear errors", () => {
      useCreateAccountStore.setState({ errors: { email: "invalid" } });

      useCreateAccountStore.getState().setEmail("john@test.com");

      const state = useCreateAccountStore.getState();
      expect(state.email).toBe("john@test.com");
      expect(state.errors).toEqual({});
    });
  });

  describe("setPhone", () => {
    it("should update phone and clear errors", () => {
      useCreateAccountStore.getState().setPhone("11999990000");

      expect(useCreateAccountStore.getState().phone).toBe("11999990000");
      expect(useCreateAccountStore.getState().errors).toEqual({});
    });
  });

  describe("setPassword", () => {
    it("should update password and clear errors", () => {
      useCreateAccountStore.getState().setPassword("Str0ng@Pass");

      expect(useCreateAccountStore.getState().password).toBe("Str0ng@Pass");
      expect(useCreateAccountStore.getState().errors).toEqual({});
    });
  });

  describe("setConfirmPassword", () => {
    it("should update confirmPassword and clear errors", () => {
      useCreateAccountStore.getState().setConfirmPassword("Str0ng@Pass");

      expect(useCreateAccountStore.getState().confirmPassword).toBe("Str0ng@Pass");
      expect(useCreateAccountStore.getState().errors).toEqual({});
    });
  });

  describe("submit", () => {
    it("should return false and set errors on validation failure", async () => {
      const validationErrors = { name: "Nome obrigatorio" };
      vi.mocked(validateCreateAccount).mockReturnValue(validationErrors);

      const result = await useCreateAccountStore.getState().submit();

      expect(result).toBe(false);
      expect(useCreateAccountStore.getState().errors).toEqual(validationErrors);
      expect(authApi.registerClient).not.toHaveBeenCalled();
    });

    it("should call registerClient and return true on success", async () => {
      useCreateAccountStore.setState({
        name: "John",
        email: "john@test.com",
        phone: "11999990000",
        password: "Str0ng@Pass",
        confirmPassword: "Str0ng@Pass",
      });
      vi.mocked(authApi.registerClient).mockResolvedValue({ message: "ok" });

      const result = await useCreateAccountStore.getState().submit();

      expect(result).toBe(true);
      expect(authApi.registerClient).toHaveBeenCalledWith({
        name: "John",
        email: "john@test.com",
        phone: "11999990000",
        password: "Str0ng@Pass",
      });
      expect(useCreateAccountStore.getState().isSubmitting).toBe(false);
    });

    it("should send phone as undefined when empty", async () => {
      useCreateAccountStore.setState({
        name: "John",
        email: "john@test.com",
        phone: "",
        password: "Str0ng@Pass",
        confirmPassword: "Str0ng@Pass",
      });
      vi.mocked(authApi.registerClient).mockResolvedValue({ message: "ok" });

      await useCreateAccountStore.getState().submit();

      expect(authApi.registerClient).toHaveBeenCalledWith(
        expect.objectContaining({ phone: undefined }),
      );
    });

    it("should map HttpClientError to field errors", async () => {
      useCreateAccountStore.setState({
        name: "John",
        email: "john@test.com",
        password: "Str0ng@Pass",
        confirmPassword: "Str0ng@Pass",
      });
      const mappedErrors = { email: "Este e-mail ja esta cadastrado" };
      vi.mocked(mapApiErrorToField).mockReturnValue(mappedErrors);
      vi.mocked(authApi.registerClient).mockRejectedValue(new HttpClientError(409, "Conflict"));

      const result = await useCreateAccountStore.getState().submit();

      expect(result).toBe(false);
      expect(mapApiErrorToField).toHaveBeenCalledWith(409, "Conflict");
      expect(useCreateAccountStore.getState().errors).toEqual(mappedErrors);
      expect(useCreateAccountStore.getState().isSubmitting).toBe(false);
    });

    it("should set generic error on non-HTTP error", async () => {
      useCreateAccountStore.setState({
        name: "John",
        email: "john@test.com",
        password: "Str0ng@Pass",
        confirmPassword: "Str0ng@Pass",
      });
      vi.mocked(authApi.registerClient).mockRejectedValue(new Error("Network"));

      const result = await useCreateAccountStore.getState().submit();

      expect(result).toBe(false);
      expect(useCreateAccountStore.getState().errors).toEqual({
        email: "Erro ao cadastrar. Tente novamente.",
      });
    });

    it("should set isSubmitting during API call", async () => {
      useCreateAccountStore.setState({
        name: "John",
        email: "john@test.com",
        password: "Str0ng@Pass",
        confirmPassword: "Str0ng@Pass",
      });

      let resolveRegister!: () => void;
      vi.mocked(authApi.registerClient).mockReturnValue(
        new Promise((resolve) => {
          resolveRegister = () => resolve({ message: "ok" });
        }),
      );

      const submitPromise = useCreateAccountStore.getState().submit();

      expect(useCreateAccountStore.getState().isSubmitting).toBe(true);

      resolveRegister();
      await submitPromise;

      expect(useCreateAccountStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useCreateAccountStore.setState({
        name: "John",
        email: "john@test.com",
        phone: "11999",
        password: "pass",
        confirmPassword: "pass",
        isSubmitting: true,
        errors: { name: "err" },
      });

      useCreateAccountStore.getState().reset();

      const state = useCreateAccountStore.getState();
      expect(state.name).toBe("");
      expect(state.email).toBe("");
      expect(state.phone).toBe("");
      expect(state.password).toBe("");
      expect(state.confirmPassword).toBe("");
      expect(state.isSubmitting).toBe(false);
      expect(state.errors).toEqual({});
    });
  });
});
