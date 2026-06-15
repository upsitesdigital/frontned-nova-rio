import { HttpClient } from "@/api/core/http-client";

class ReceiptsApi {
  static fetchReceiptBlob(paymentId: number): Promise<Blob> {
    return HttpClient.authGetBlob(`/clients/payments/${paymentId}/receipt`);
  }
}

export { ReceiptsApi };
