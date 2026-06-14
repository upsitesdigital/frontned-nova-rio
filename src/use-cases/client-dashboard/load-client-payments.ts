import {
  PaymentsApi,
  type PaymentEntry,
  type PaymentStatus,
} from "@/api/client/payments-api";
import { Messages } from "@/lib/core/messages";

interface LoadClientPaymentsInput {
  page: number;
  limit: number;
  status?: PaymentStatus;
  signal?: AbortSignal;
}

interface LoadClientPaymentsResult {
  data: { payments: PaymentEntry[]; total: number } | null;
  error: string | null;
}

class LoadClientPayments {
  static async loadClientPayments(
    input: LoadClientPaymentsInput,
  ): Promise<LoadClientPaymentsResult> {
    try {
      const result = await PaymentsApi.fetchClientPayments(input.page, input.limit, input.status, input.signal);
      return { data: { payments: result.data, total: result.total }, error: null };
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return { data: null, error: null };
      }
      return { data: null, error: Messages.payments.loadError };
    }
  }
}

export { LoadClientPayments, type LoadClientPaymentsInput, type LoadClientPaymentsResult };
