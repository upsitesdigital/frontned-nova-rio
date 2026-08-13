import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAdminPaymentsStore } from "./admin-payments-store";
import { CancelAdminPayment } from "@/use-cases/admin-reports/cancel-admin-payment";
import { LoadAdminPayments } from "@/use-cases/admin-reports/load-admin-payments";
import type { AdminPayment } from "@/api/admin/admin-payments-api";
import { Messages } from "@/lib/core/messages";

vi.mock("@/use-cases/admin-reports/load-admin-payments", () => ({
  LoadAdminPayments: { loadAdminPayments: vi.fn() },
}));

vi.mock("@/use-cases/admin-reports/load-admin-payment-detail", () => ({
  LoadAdminPaymentDetail: { loadAdminPaymentDetail: vi.fn() },
}));

vi.mock("@/use-cases/admin-reports/cancel-admin-payment", () => ({
  CancelAdminPayment: { cancelAdminPayment: vi.fn() },
}));

const pendingPayment = { id: 7, status: "PENDING" } as AdminPayment;

describe("useAdminPaymentsStore.cancelSelectedPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminPaymentsStore.getState().reset();
    vi.mocked(LoadAdminPayments.loadAdminPayments).mockResolvedValue({
      data: { payments: [], total: 0, page: 1 },
      error: null,
      isAuthError: false,
    });
  });

  it("cancels the selected pending payment and closes the details", async () => {
    vi.mocked(CancelAdminPayment.cancelAdminPayment).mockResolvedValue({
      success: true,
      error: null,
      isAuthError: false,
    });
    useAdminPaymentsStore.setState({
      selectedPaymentId: 7,
      selectedPayment: pendingPayment,
      isCancelConfirmOpen: true,
    });

    await useAdminPaymentsStore.getState().cancelSelectedPayment();

    expect(CancelAdminPayment.cancelAdminPayment).toHaveBeenCalledWith(7);
    expect(useAdminPaymentsStore.getState().selectedPayment).toBeNull();
    expect(useAdminPaymentsStore.getState().isCancelConfirmOpen).toBe(false);
    expect(LoadAdminPayments.loadAdminPayments).toHaveBeenCalled();
  });

  it("refuses to cancel a payment that is not pending", async () => {
    useAdminPaymentsStore.setState({
      selectedPaymentId: 7,
      selectedPayment: { ...pendingPayment, status: "APPROVED" },
      isCancelConfirmOpen: true,
    });

    await useAdminPaymentsStore.getState().cancelSelectedPayment();

    expect(CancelAdminPayment.cancelAdminPayment).not.toHaveBeenCalled();
    expect(useAdminPaymentsStore.getState().detailError).toBe(
      Messages.adminPayments.cancelNotPending,
    );
  });

  it("keeps the details open and surfaces the error when cancelling fails", async () => {
    vi.mocked(CancelAdminPayment.cancelAdminPayment).mockResolvedValue({
      success: false,
      error: "Erro ao cancelar o pagamento.",
      isAuthError: false,
    });
    useAdminPaymentsStore.setState({
      selectedPaymentId: 7,
      selectedPayment: pendingPayment,
      isCancelConfirmOpen: true,
    });

    await useAdminPaymentsStore.getState().cancelSelectedPayment();

    expect(useAdminPaymentsStore.getState().selectedPayment).not.toBeNull();
    expect(useAdminPaymentsStore.getState().detailError).toBe("Erro ao cancelar o pagamento.");
    expect(useAdminPaymentsStore.getState().isCancelling).toBe(false);
  });
});
