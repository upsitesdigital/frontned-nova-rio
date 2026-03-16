import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/validate-address", () => ({
  validateAddress: vi.fn(),
}));

const { validateAddress } = await import("@/use-cases/validate-address");
const { useAddressStore } = await import("./address-store");

describe("AddressStore", () => {
  beforeEach(() => {
    useAddressStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have default values", () => {
      const state = useAddressStore.getState();

      expect(state.cep).toBe("");
      expect(state.address).toBeNull();
      expect(state.isLoadingAddress).toBe(false);
      expect(state.cepError).toBeNull();
    });
  });

  describe("setCep", () => {
    it("should update cep", () => {
      useAddressStore.getState().setCep("20040020");

      expect(useAddressStore.getState().cep).toBe("20040020");
    });
  });

  describe("loadAddressByCep", () => {
    it("should load address on success", async () => {
      const address = {
        cep: "20040020",
        street: "Rua A",
        neighborhood: "Centro",
        city: "Rio de Janeiro",
        state: "RJ",
      };
      vi.mocked(validateAddress).mockResolvedValue({ address, error: null });

      await useAddressStore.getState().loadAddressByCep("20040020");

      const state = useAddressStore.getState();
      expect(state.address).toEqual(address);
      expect(state.isLoadingAddress).toBe(false);
      expect(state.cepError).toBeNull();
    });

    it("should set cepError when address validation returns error", async () => {
      vi.mocked(validateAddress).mockResolvedValue({
        address: null,
        error: "Fora da area de atendimento.",
      });

      await useAddressStore.getState().loadAddressByCep("99999999");

      const state = useAddressStore.getState();
      expect(state.address).toBeNull();
      expect(state.cepError).toBe("Fora da area de atendimento.");
    });

    it("should set fallback error on exception", async () => {
      vi.mocked(validateAddress).mockRejectedValue(new Error("Network"));

      await useAddressStore.getState().loadAddressByCep("00000000");

      const state = useAddressStore.getState();
      expect(state.address).toBeNull();
      expect(state.cepError).toBe("CEP não encontrado");
      expect(state.isLoadingAddress).toBe(false);
    });

    it("should set isLoadingAddress during API call", async () => {
      let resolveValidate!: (value: { address: null; error: null }) => void;
      vi.mocked(validateAddress).mockReturnValue(
        new Promise((resolve) => {
          resolveValidate = resolve;
        }),
      );

      const loadPromise = useAddressStore.getState().loadAddressByCep("20040020");

      expect(useAddressStore.getState().isLoadingAddress).toBe(true);

      resolveValidate({ address: null, error: null });
      await loadPromise;

      expect(useAddressStore.getState().isLoadingAddress).toBe(false);
    });
  });

  describe("clearAddress", () => {
    it("should clear address and cepError", () => {
      useAddressStore.setState({
        address: {
          cep: "20040020",
          street: "Rua A",
          neighborhood: "Centro",
          city: "RJ",
          state: "RJ",
        },
        cepError: "some error",
      });

      useAddressStore.getState().clearAddress();

      expect(useAddressStore.getState().address).toBeNull();
      expect(useAddressStore.getState().cepError).toBeNull();
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useAddressStore.setState({
        cep: "20040020",
        address: {
          cep: "20040020",
          street: "Rua A",
          neighborhood: "Centro",
          city: "RJ",
          state: "RJ",
        },
        isLoadingAddress: true,
        cepError: "err",
      });

      useAddressStore.getState().reset();

      const state = useAddressStore.getState();
      expect(state.cep).toBe("");
      expect(state.address).toBeNull();
      expect(state.isLoadingAddress).toBe(false);
      expect(state.cepError).toBeNull();
    });
  });
});
