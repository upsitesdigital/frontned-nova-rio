import {
  fetchClientPayments,
  type PaymentEntry,
  type PaymentStatus,
} from "@/api/payments-api";
import { MESSAGES } from "@/lib/messages";

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

async function loadClientPayments(
  input: LoadClientPaymentsInput,
): Promise<LoadClientPaymentsResult> {
  try {
    const result = await fetchClientPayments(
      input.page,
      input.limit,
      input.status,
      input.signal,
    );
    return { data: { payments: result.data, total: result.total }, error: null };
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { data: null, error: null };
    }
    return { data: null, error: MESSAGES.payments.loadError };
  }
}

export { loadClientPayments, type LoadClientPaymentsInput, type LoadClientPaymentsResult };
