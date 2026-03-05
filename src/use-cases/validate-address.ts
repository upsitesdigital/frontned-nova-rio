import { getCoverageByCep } from "@/api/scheduling-data";
import type { Address } from "@/types/scheduling";

interface ValidateAddressResult {
  address: Address | null;
  error: string | null;
}

async function validateAddress(cep: string): Promise<ValidateAddressResult> {
  const result = await getCoverageByCep(cep);

  if (!result.covered) {
    return { address: null, error: "Endereço fora da área de atendimento" };
  }

  return { address: result.address, error: null };
}

export { validateAddress, type ValidateAddressResult };
