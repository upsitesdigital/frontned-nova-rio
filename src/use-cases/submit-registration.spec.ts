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

vi.mock("@/validation/register-schema", () => ({
  validateRegister: vi.fn(),
  mapApiErrorToField: vi.fn(),
}));

const api = await import("@/api/auth-api");
const { HttpClientError } = await import("@/api/http-client");
const validation = await import("@/validation/register-schema");
const { submitRegistration, validateRegistrationInput } = await import("./submit-registration");

describe("validateRegistrationInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call validateRegister with name, email, and password", () => {
    vi.mocked(validation.validateRegister).mockReturnValue({});

    validateRegistrationInput({
      name: "John",
      email: "john@mail.com",
      phone: "11999999999",
      password: "Pass@1234",
    });

    expect(validation.validateRegister).toHaveBeenCalledWith({
      name: "John",
      email: "john@mail.com",
      password: "Pass@1234",
    });
  });

  it("should return errors from validateRegister", () => {
    vi.mocked(validation.validateRegister).mockReturnValue({ name: "Nome obrigatorio" });

    const errors = validateRegistrationInput({
      name: "",
      email: "a@b.com",
      phone: "",
      password: "Pass@1234",
    });

    expect(errors).toEqual({ name: "Nome obrigatorio" });
  });

  it("should return empty object when input is valid", () => {
    vi.mocked(validation.validateRegister).mockReturnValue({});

    const errors = validateRegistrationInput({
      name: "Jane",
      email: "jane@mail.com",
      phone: "",
      password: "Str0ng!Pass",
    });

    expect(errors).toEqual({});
  });
});

describe("submitRegistration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty errors on successful registration", async () => {
    vi.mocked(api.registerClient).mockResolvedValue({ message: "ok" });

    const result = await submitRegistration({
      name: "John",
      email: "john@mail.com",
      phone: "11999999999",
      password: "Pass@1234",
    });

    expect(result).toEqual({});
  });

  it("should call registerClient with correct payload including phone", async () => {
    vi.mocked(api.registerClient).mockResolvedValue({ message: "ok" });

    await submitRegistration({
      name: "John",
      email: "john@mail.com",
      phone: "11999999999",
      password: "Pass@1234",
    });

    expect(api.registerClient).toHaveBeenCalledWith({
      name: "John",
      email: "john@mail.com",
      phone: "11999999999",
      password: "Pass@1234",
    });
  });

  it("should pass undefined phone when phone is empty string", async () => {
    vi.mocked(api.registerClient).mockResolvedValue({ message: "ok" });

    await submitRegistration({
      name: "John",
      email: "john@mail.com",
      phone: "",
      password: "Pass@1234",
    });

    expect(api.registerClient).toHaveBeenCalledWith({
      name: "John",
      email: "john@mail.com",
      phone: undefined,
      password: "Pass@1234",
    });
  });

  it("should map HttpClientError to field errors via mapApiErrorToField", async () => {
    const httpError = new HttpClientError(409, "Conflict");
    vi.mocked(api.registerClient).mockRejectedValue(httpError);
    vi.mocked(validation.mapApiErrorToField).mockReturnValue({ email: "Email already exists" });

    const result = await submitRegistration({
      name: "John",
      email: "john@mail.com",
      phone: "",
      password: "Pass@1234",
    });

    expect(validation.mapApiErrorToField).toHaveBeenCalledWith(409, "Conflict");
    expect(result).toEqual({ email: "Email already exists" });
  });

  it("should return generic email error for non-HttpClientError exceptions", async () => {
    vi.mocked(api.registerClient).mockRejectedValue(new Error("Unknown"));

    const result = await submitRegistration({
      name: "John",
      email: "john@mail.com",
      phone: "",
      password: "Pass@1234",
    });

    expect(result).toEqual({ email: "Erro ao cadastrar. Tente novamente." });
  });

  it("should not call mapApiErrorToField for non-HttpClientError", async () => {
    vi.mocked(api.registerClient).mockRejectedValue(new TypeError("type error"));

    await submitRegistration({
      name: "John",
      email: "john@mail.com",
      phone: "",
      password: "Pass@1234",
    });

    expect(validation.mapApiErrorToField).not.toHaveBeenCalled();
  });
});
