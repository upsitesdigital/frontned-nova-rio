import { fetchCoverageByCep } from "@/api/scheduling-api";
import { MESSAGES } from "@/lib/messages";
import type { Address } from "@/types/scheduling";

interface ValidateAddressResult {
  address: Address | null;
  error: string | null;
}

async function validateAddress(cep: string): Promise<ValidateAddressResult> {
  try {
    const result = await fetchCoverageByCep(cep);

    if (!result.covered) {
      return { address: null, error: MESSAGES.address.outOfCoverage };
    }

    return { address: result.address, error: null };
  } catch {
    return { address: null, error: MESSAGES.address.validationError };
  }
}

export { validateAddress, type ValidateAddressResult };
