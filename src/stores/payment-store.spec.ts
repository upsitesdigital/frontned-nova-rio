import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/submit-payment", () => ({
  submitPayment: vi.fn(),
}));

vi.mock("@/validation/payment-schema", () => ({
  validatePayment: vi.fn(),
}));

vi.mock("@/stores/confirmation-store", () => {
  const setConfirmation = vi.fn();
  return {
    useConfirmationStore: {
      getState: () => ({ setConfirmation }),
    },
  };
});

vi.mock("@/stores/registration-store", () => ({
  useRegistrationStore: {
    getState: () => ({ email: "" }),
  },
}));

vi.mock("@/stores/services-store", () => ({
  useServicesStore: {
    getState: () => ({ selectedServiceId: null }),
  },
}));

vi.mock("@/stores/scheduling-store", () => ({
  useSchedulingStore: {
    getState: () => ({
      selectedDate: null,
      selectedTime: null,
      recurrenceType: null,
    }),
  },
}));

vi.mock("@/stores/address-store", () => ({
  useAddressStore: {
    getState: () => ({ cep: "", address: null }),
  },
}));

const { submitPayment } = await import("@/use-cases/submit-payment");
const { validatePayment } = await import("@/validation/payment-schema");
const { useConfirmationStore } = await import("@/stores/confirmation-store");
const { useRegistrationStore } = await import("@/stores/registration-store");
const { useServicesStore } = await import("@/stores/services-store");
const { useSchedulingStore } = await import("@/stores/scheduling-store");
const { useAddressStore } = await import("@/stores/address-store");
const { usePaymentStore } = await import("./payment-store");

describe("PaymentStore", () => {
  beforeEach(() => {
    usePaymentStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(validatePayment).mockReturnValue({});
  });

  describe("initial state", () => {
    it("should have default values", () => {
      const state = usePaymentStore.getState();

      expect(state.paymentMethod).toBeNull();
      expect(state.cardNumber).toBe("");
      expect(state.cardExpiry).toBe("");
      expect(state.cardCvv).toBe("");
      expect(state.cardName).toBe("");
      expect(state.billingName).toBe("");
      expect(state.billingDocument).toBe("");
      expect(state.billingAddress).toBe("");
      expect(state.billingComplement).toBe("");
      expect(state.errors).toEqual({});
      expect(state.isSubmitting).toBe(false);
      expect(state.submitError).toBeNull();
    });
  });

  describe("setPaymentMethod", () => {
    it("should update method and clear errors and submitError", () => {
      usePaymentStore.setState({
        errors: { cardNumber: "required" },
        submitError: "some error",
      });

      usePaymentStore.getState().setPaymentMethod("pix");

      const state = usePaymentStore.getState();
      expect(state.paymentMethod).toBe("pix");
      expect(state.errors).toEqual({});
      expect(state.submitError).toBeNull();
    });
  });

  describe("field setters", () => {
    it("should update cardNumber and clear errors", () => {
      usePaymentStore.getState().setCardNumber("4111111111111111");

      expect(usePaymentStore.getState().cardNumber).toBe("4111111111111111");
      expect(usePaymentStore.getState().errors).toEqual({});
    });

    it("should update cardExpiry and clear errors", () => {
      usePaymentStore.getState().setCardExpiry("12/28");

      expect(usePaymentStore.getState().cardExpiry).toBe("12/28");
    });

    it("should update cardCvv and clear errors", () => {
      usePaymentStore.getState().setCardCvv("123");

      expect(usePaymentStore.getState().cardCvv).toBe("123");
    });

    it("should update cardName and clear errors", () => {
      usePaymentStore.getState().setCardName("JOHN DOE");

      expect(usePaymentStore.getState().cardName).toBe("JOHN DOE");
    });

    it("should update billingName and clear errors", () => {
      usePaymentStore.getState().setBillingName("John");

      expect(usePaymentStore.getState().billingName).toBe("John");
    });

    it("should update billingDocument and clear errors", () => {
      usePaymentStore.getState().setBillingDocument("12345678901");

      expect(usePaymentStore.getState().billingDocument).toBe("12345678901");
    });

    it("should update billingAddress and clear errors", () => {
      usePaymentStore.getState().setBillingAddress("Rua A, 123");

      expect(usePaymentStore.getState().billingAddress).toBe("Rua A, 123");
    });

    it("should update billingComplement and clear errors", () => {
      usePaymentStore.getState().setBillingComplement("Apto 1");

      expect(usePaymentStore.getState().billingComplement).toBe("Apto 1");
    });
  });

  describe("validate", () => {
    it("should return true when no validation errors", () => {
      usePaymentStore.setState({ paymentMethod: "pix" });

      const result = usePaymentStore.getState().validate();

      expect(result).toBe(true);
      expect(usePaymentStore.getState().errors).toEqual({});
    });

    it("should return false and set errors on validation failure", () => {
      usePaymentStore.setState({ paymentMethod: "credit" });
      const errors = { cardNumber: "Numero do cartao invalido" };
      vi.mocked(validatePayment).mockReturnValue(errors);

      const result = usePaymentStore.getState().validate();

      expect(result).toBe(false);
      expect(usePaymentStore.getState().errors).toEqual(errors);
    });

    it("should pass isCardMethod=true for credit method", () => {
      usePaymentStore.setState({ paymentMethod: "credit" });

      usePaymentStore.getState().validate();

      expect(validatePayment).toHaveBeenCalledWith(true, expect.any(Object), expect.any(Object));
    });

    it("should pass isCardMethod=true for debit method", () => {
      usePaymentStore.setState({ paymentMethod: "debit" });

      usePaymentStore.getState().validate();

      expect(validatePayment).toHaveBeenCalledWith(true, expect.any(Object), expect.any(Object));
    });

    it("should pass isCardMethod=false for pix method", () => {
      usePaymentStore.setState({ paymentMethod: "pix" });

      usePaymentStore.getState().validate();

      expect(validatePayment).toHaveBeenCalledWith(false, expect.any(Object), expect.any(Object));
    });
  });

  describe("pay", () => {
    it("should return false when validation fails", async () => {
      vi.mocked(validatePayment).mockReturnValue({ cardNumber: "required" });
      usePaymentStore.setState({ paymentMethod: "credit" });

      const result = await usePaymentStore.getState().pay();

      expect(result).toBe(false);
      expect(submitPayment).not.toHaveBeenCalled();
    });

    it("should return false when email is empty", async () => {
      vi.spyOn(useRegistrationStore, "getState").mockReturnValue({ email: "" } as never);
      usePaymentStore.setState({ paymentMethod: "pix" });

      const result = await usePaymentStore.getState().pay();

      expect(result).toBe(false);
      expect(usePaymentStore.getState().submitError).toBe(
        "E-mail não cadastrado. Volte ao passo de cadastro.",
      );
    });

    it("should return false when no service is selected", async () => {
      vi.spyOn(useRegistrationStore, "getState").mockReturnValue({
        email: "test@test.com",
      } as never);
      vi.spyOn(useServicesStore, "getState").mockReturnValue({
        selectedServiceId: null,
      } as never);
      usePaymentStore.setState({ paymentMethod: "pix" });

      const result = await usePaymentStore.getState().pay();

      expect(result).toBe(false);
      expect(usePaymentStore.getState().submitError).toBe("Nenhum serviço selecionado.");
    });

    it("should return false when date or time is missing", async () => {
      vi.spyOn(useRegistrationStore, "getState").mockReturnValue({
        email: "test@test.com",
      } as never);
      vi.spyOn(useServicesStore, "getState").mockReturnValue({
        selectedServiceId: 1,
      } as never);
      vi.spyOn(useSchedulingStore, "getState").mockReturnValue({
        selectedDate: null,
        selectedTime: null,
        recurrenceType: null,
      } as never);
      usePaymentStore.setState({ paymentMethod: "pix" });

      const result = await usePaymentStore.getState().pay();

      expect(result).toBe(false);
      expect(usePaymentStore.getState().submitError).toBe("Data e horário não selecionados.");
    });

    it("should call submitPayment and return true on success", async () => {
      const selectedDate = new Date(2026, 2, 20);
      vi.spyOn(useRegistrationStore, "getState").mockReturnValue({
        email: "test@test.com",
      } as never);
      vi.spyOn(useServicesStore, "getState").mockReturnValue({
        selectedServiceId: 1,
      } as never);
      vi.spyOn(useSchedulingStore, "getState").mockReturnValue({
        selectedDate,
        selectedTime: "10:00",
        recurrenceType: "avulso",
      } as never);
      vi.spyOn(useAddressStore, "getState").mockReturnValue({
        cep: "20040020",
        address: null,
      } as never);
      usePaymentStore.setState({ paymentMethod: "pix" });

      const confirmation = {
        serviceName: "Limpeza",
        date: "2026-03-20",
        startTime: "10:00",
      };
      vi.mocked(submitPayment).mockResolvedValue({
        success: true,
        confirmation,
      });

      const result = await usePaymentStore.getState().pay();

      expect(result).toBe(true);
      expect(useConfirmationStore.getState().setConfirmation).toHaveBeenCalledWith(confirmation);
      expect(usePaymentStore.getState().isSubmitting).toBe(false);
    });

    it("should set submitError on payment failure", async () => {
      vi.spyOn(useRegistrationStore, "getState").mockReturnValue({
        email: "test@test.com",
      } as never);
      vi.spyOn(useServicesStore, "getState").mockReturnValue({
        selectedServiceId: 1,
      } as never);
      vi.spyOn(useSchedulingStore, "getState").mockReturnValue({
        selectedDate: new Date(),
        selectedTime: "10:00",
        recurrenceType: null,
      } as never);
      vi.spyOn(useAddressStore, "getState").mockReturnValue({
        cep: "",
        address: null,
      } as never);
      usePaymentStore.setState({ paymentMethod: "pix" });

      vi.mocked(submitPayment).mockResolvedValue({
        success: false,
        error: "Pagamento recusado.",
      });

      const result = await usePaymentStore.getState().pay();

      expect(result).toBe(false);
      expect(usePaymentStore.getState().submitError).toBe("Pagamento recusado.");
      expect(usePaymentStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      usePaymentStore.setState({
        paymentMethod: "credit",
        cardNumber: "4111",
        cardExpiry: "12/28",
        cardCvv: "123",
        cardName: "JOHN",
        billingName: "John",
        billingDocument: "12345678901",
        billingAddress: "Rua A",
        billingComplement: "Apto 1",
        errors: { cardNumber: "err" },
        isSubmitting: true,
        submitError: "err",
      });

      usePaymentStore.getState().reset();

      const state = usePaymentStore.getState();
      expect(state.paymentMethod).toBeNull();
      expect(state.cardNumber).toBe("");
      expect(state.isSubmitting).toBe(false);
      expect(state.errors).toEqual({});
      expect(state.submitError).toBeNull();
    });
  });
});
