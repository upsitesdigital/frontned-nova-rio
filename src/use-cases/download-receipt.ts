import { fetchReceiptBlob } from "@/api/receipts-api";
import { triggerBlobDownload } from "@/lib/download-helpers";

async function downloadReceipt(paymentId: number): Promise<void> {
  const blob = await fetchReceiptBlob(paymentId);
  triggerBlobDownload(blob, `recibo-${paymentId}.pdf`);
}

export { downloadReceipt };
