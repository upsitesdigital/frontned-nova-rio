import { ReceiptsApi } from "@/api/client/receipts-api";
import { DownloadHelpers } from "@/lib/core/download-helpers";

class DownloadReceipt {
  static async downloadReceipt(paymentId: number): Promise<void> {
    const blob = await ReceiptsApi.fetchReceiptBlob(paymentId);
    DownloadHelpers.triggerBlobDownload(blob, `recibo-${paymentId}.pdf`);
  }
}

export { DownloadReceipt };
