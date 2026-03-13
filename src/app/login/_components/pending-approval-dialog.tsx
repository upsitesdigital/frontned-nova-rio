"use client";

import { DsButton, DsDialog } from "@/design-system";

interface PendingApprovalDialogProps {
  open: boolean;
  onClose: () => void;
}

function PendingApprovalDialog({ open, onClose }: PendingApprovalDialogProps) {
  return (
    <DsDialog
      open={open}
      onOpenChange={(value) => !value && onClose()}
      title="Cadastro em análise"
      description="Seu cadastro está sendo analisado pela nossa equipe. Você receberá um e-mail assim que sua conta for aprovada."
      footer={
        <DsButton onClick={onClose} className="w-full">
          Entendi
        </DsButton>
      }
    >
      <p className="text-sm leading-relaxed text-nova-gray-600">
        Caso tenha dúvidas, entre em contato com nosso suporte.
      </p>
    </DsDialog>
  );
}

export { PendingApprovalDialog, type PendingApprovalDialogProps };
