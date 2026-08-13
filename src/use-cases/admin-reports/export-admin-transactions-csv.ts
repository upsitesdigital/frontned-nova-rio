import { AdminReportsApi } from "@/api/admin/admin-reports-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { DownloadHelpers } from "@/lib/core/download-helpers";
import { Messages } from "@/lib/core/messages";

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

class ExportAdminTransactionsCsv {
  static async exportAdminTransactionsCsv(
    input: ExportAdminTransactionsCsvInput,
  ): Promise<ExportAdminTransactionsCsvResult> {
    try {
      const fileBlob = await AdminReportsApi.fetchAdminTransactionsExportCsv(input);
      DownloadHelpers.triggerBlobDownload(fileBlob, buildExportFilename());
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminReports.exportError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  ExportAdminTransactionsCsv,
  type ExportAdminTransactionsCsvInput,
  type ExportAdminTransactionsCsvResult,
};
