import { appConfig } from "@/config/app";
import { getAuthToken } from "@/lib/auth-helpers";

async function downloadReceipt(paymentId: number): Promise<void> {
  const token = await getAuthToken();

  const response = await fetch(`${appConfig.apiBaseUrl}/clients/payments/${paymentId}/receipt`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Erro ao baixar recibo");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `recibo-${paymentId}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export { downloadReceipt };
