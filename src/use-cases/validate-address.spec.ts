import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/scheduling-api", () => ({
  fetchCoverageByCep: vi.fn(),
}));

const api = await import("@/api/scheduling-api");
const { validateAddress } = await import("./validate-address");

const fakeAddress = {
  cep: "20040-020",
  street: "Rua A",
  neighborhood: "Centro",
  city: "Rio de Janeiro",
  state: "RJ",
};

describe("validateAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return address when coverage is confirmed", async () => {
      vi.mocked(api.fetchCoverageByCep).mockResolvedValue({
        covered: true,
        address: fakeAddress,
        unitId: 1,
        unitName: "Unit 1",
      });

      const result = await validateAddress("20040-020");

      expect(result).toEqual({ address: fakeAddress, error: null });
    });
  });

  describe("not covered", () => {
    it("should return error when address is not covered", async () => {
      vi.mocked(api.fetchCoverageByCep).mockResolvedValue({
        covered: false,
        address: fakeAddress,
        unitId: null,
        unitName: null,
      });

      const result = await validateAddress("99999-999");

      expect(result).toEqual({
        address: null,
        error: "Endereço fora da área de atendimento.",
      });
    });
  });

  describe("error handling", () => {
    it("should return error message on API failure", async () => {
      vi.mocked(api.fetchCoverageByCep).mockRejectedValue(new Error("Network"));

      const result = await validateAddress("20040-020");

      expect(result).toEqual({
        address: null,
        error: "Erro ao validar o endereço. Tente novamente.",
      });
    });
  });

  describe("edge cases", () => {
    it("should pass the cep string to the API as-is", async () => {
      vi.mocked(api.fetchCoverageByCep).mockResolvedValue({
        covered: true,
        address: fakeAddress,
        unitId: 1,
        unitName: "Unit 1",
      });

      await validateAddress("12345-678");

      expect(api.fetchCoverageByCep).toHaveBeenCalledWith("12345-678");
    });
  });
});
