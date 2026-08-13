"use client";

import { DsCancelConfirmPopup } from "@/design-system";
import { useAdminPaymentsStore } from "@/stores/admin/admin-payments-store";

export function AdminPaymentCancelConfirm() {
  const { isCancelConfirmOpen, isCancelling, cancelSelectedPayment, closeCancelConfirm } =
    useAdminPaymentsStore();

  return (
    <DsCancelConfirmPopup
      open={isCancelConfirmOpen}
      title="Cancelar cobrança"
      description="A cobrança será cancelada na operadora, o agendamento será liberado e o cliente receberá um e-mail. Esta ação não pode ser desfeita."
      confirmLabel={isCancelling ? "Cancelando..." : "Sim, cancelar cobrança"}
      confirmDisabled={isCancelling}
      cancelLabel="Voltar"
      closeLabel="Fechar"
      onConfirm={cancelSelectedPayment}
      onCancel={closeCancelConfirm}
      onClose={closeCancelConfirm}
    />
  );
}
