import { httpAuthGetBlob } from "./http-client";

async function fetchReceiptBlob(paymentId: number): Promise<Blob> {
  return httpAuthGetBlob(`/clients/payments/${paymentId}/receipt`);
}

export { fetchReceiptBlob };
