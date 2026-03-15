import { httpAuthGetBlob } from "./http-client";

async function downloadReceipt(paymentId: number): Promise<void> {
  const blob = await httpAuthGetBlob(`/clients/payments/${paymentId}/receipt`);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `recibo-${paymentId}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export { downloadReceipt };
