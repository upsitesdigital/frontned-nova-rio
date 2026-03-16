import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/submit-registration", () => ({
  validateRegistrationInput: vi.fn(),
  submitRegistration: vi.fn(),
}));

const { validateRegistrationInput, submitRegistration } = await import(
  "@/use-cases/submit-registration"
);
const { useRegistrationStore } = await import("./registration-store");

describe("RegistrationStore", () => {
  beforeEach(() => {
    useRegistrationStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(validateRegistrationInput).mockReturnValue({});
  });

  describe("initial state", () => {
    it("should have empty fields and default flags", () => {
      const state = useRegistrationStore.getState();

      expect(state.name).toBe("");
      expect(state.email).toBe("");
      expect(state.phone).toBe("");
      expect(state.password).toBe("");
      expect(state.isRegistering).toBe(false);
      expect(state.errors).toEqual({});
      expect(state.success).toBe(false);
    });
  });

  describe("setName", () => {
    it("should update name and clear errors", () => {
      useRegistrationStore.setState({ errors: { name: "required" } });

      useRegistrationStore.getState().setName("Ana");

      expect(useRegistrationStore.getState().name).toBe("Ana");
      expect(useRegistrationStore.getState().errors).toEqual({});
    });
  });

  describe("setEmail", () => {
    it("should update email and clear errors", () => {
      useRegistrationStore.setState({ errors: { email: "invalid" } });

      useRegistrationStore.getState().setEmail("ana@test.com");

      expect(useRegistrationStore.getState().email).toBe("ana@test.com");
      expect(useRegistrationStore.getState().errors).toEqual({});
    });
  });

  describe("setPhone", () => {
    it("should update phone and clear errors", () => {
      useRegistrationStore.getState().setPhone("21988887777");

      expect(useRegistrationStore.getState().phone).toBe("21988887777");
      expect(useRegistrationStore.getState().errors).toEqual({});
    });
  });

  describe("setPassword", () => {
    it("should update password and clear errors", () => {
      useRegistrationStore.getState().setPassword("Str0ng@Pass");

      expect(useRegistrationStore.getState().password).toBe("Str0ng@Pass");
      expect(useRegistrationStore.getState().errors).toEqual({});
    });
  });

  describe("submit", () => {
    it("should return false and set errors on validation failure", async () => {
      const validationErrors = { email: "E-mail invalido" };
      vi.mocked(validateRegistrationInput).mockReturnValue(validationErrors);

      const result = await useRegistrationStore.getState().submit();

      expect(result).toBe(false);
      expect(useRegistrationStore.getState().errors).toEqual(validationErrors);
      expect(submitRegistration).not.toHaveBeenCalled();
    });

    it("should call submitRegistration and return true on success", async () => {
      useRegistrationStore.setState({
        name: "Ana",
        email: "ana@test.com",
        phone: "21988887777",
        password: "Str0ng@Pass",
      });
      vi.mocked(submitRegistration).mockResolvedValue({});

      const result = await useRegistrationStore.getState().submit();

      expect(result).toBe(true);
      expect(useRegistrationStore.getState().success).toBe(true);
      expect(useRegistrationStore.getState().isRegistering).toBe(false);
    });

    it("should return false and set errors on API failure", async () => {
      useRegistrationStore.setState({
        name: "Ana",
        email: "ana@test.com",
        phone: "",
        password: "Str0ng@Pass",
      });
      const apiErrors = { email: "Este e-mail ja esta cadastrado" };
      vi.mocked(submitRegistration).mockResolvedValue(apiErrors);

      const result = await useRegistrationStore.getState().submit();

      expect(result).toBe(false);
      expect(useRegistrationStore.getState().errors).toEqual(apiErrors);
      expect(useRegistrationStore.getState().isRegistering).toBe(false);
    });

    it("should set isRegistering during API call", async () => {
      useRegistrationStore.setState({
        name: "Ana",
        email: "ana@test.com",
        phone: "",
        password: "Str0ng@Pass",
      });

      let resolveSubmit!: (value: Record<string, string>) => void;
      vi.mocked(submitRegistration).mockReturnValue(
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
      );

      const submitPromise = useRegistrationStore.getState().submit();

      expect(useRegistrationStore.getState().isRegistering).toBe(true);

      resolveSubmit({});
      await submitPromise;

      expect(useRegistrationStore.getState().isRegistering).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useRegistrationStore.setState({
        name: "Ana",
        email: "ana@test.com",
        phone: "21988887777",
        password: "pass",
        isRegistering: true,
        errors: { name: "err" },
        success: true,
      });

      useRegistrationStore.getState().reset();

      const state = useRegistrationStore.getState();
      expect(state.name).toBe("");
      expect(state.email).toBe("");
      expect(state.phone).toBe("");
      expect(state.password).toBe("");
      expect(state.isRegistering).toBe(false);
      expect(state.errors).toEqual({});
      expect(state.success).toBe(false);
    });
  });
});
