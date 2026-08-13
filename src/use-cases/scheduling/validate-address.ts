import { SchedulingApi } from "@/api/client/scheduling-api";
import { Messages } from "@/lib/core/messages";
import type { Address } from "@/types/scheduling";

interface ValidateAddressResult {
  address: Address | null;
  error: string | null;
}

class ValidateAddress {
  static async validateAddress(cep: string): Promise<ValidateAddressResult> {
    try {
      const result = await SchedulingApi.fetchCoverageByCep(cep);

      if (!result.covered) {
        return { address: null, error: Messages.address.outOfCoverage };
      }

      return { address: result.address, error: null };
    } catch {
      return { address: null, error: Messages.address.validationError };
    }
  }
}

export { ValidateAddress, type ValidateAddressResult };
