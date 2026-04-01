import { fetchAdminTransactionsExportCsv } from "@/api/admin-reports-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { triggerBlobDownload } from "@/lib/download-helpers";
import { MESSAGES } from "@/lib/messages";

interface ExportAdminTransactionsCsvInput {
  dateFrom?: string;
  dateTo?: string;
  unitId?: number;
  serviceId?: number;
}

interface ExportAdminTransactionsCsvResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

function buildExportFilename(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `transacoes-${day}-${month}-${year}.csv`;
}

async function exportAdminTransactionsCsv(
  input: ExportAdminTransactionsCsvInput,
): Promise<ExportAdminTransactionsCsvResult> {
  try {
    const fileBlob = await fetchAdminTransactionsExportCsv(input);
    triggerBlobDownload(fileBlob, buildExportFilename());
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminReports.exportError),
      isAuthError: isAuthError(error),
    };
  }
}

export {
  exportAdminTransactionsCsv,
  type ExportAdminTransactionsCsvInput,
  type ExportAdminTransactionsCsvResult,
};