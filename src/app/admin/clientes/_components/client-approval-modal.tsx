"use client";

import { HourglassIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsApprovalPopup,
  type DsClientTableClient,
  type DsApprovalPopupDetail,
  type DsApprovalPopupStatus,
} from "@/design-system";

const PENDING_STATUS: DsApprovalPopupStatus = {
  icon: HourglassIcon,
  label: "Pendente",
  color: "text-nova-warning",
  bgColor: "bg-nova-warning/10",
};

interface ClientApprovalModalProps {
  client: DsClientTableClient | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

function buildDetails(client: DsClientTableClient): DsApprovalPopupDetail[] {
  return [
    { label: "Empresa", value: client.company },
    { label: "CPF", value: client.document },
    { label: "Unidade", value: client.unit },
    { label: "E-mail", value: client.email },
  ];
}

function ClientApprovalModal({ client, onApprove, onReject, onClose }: ClientApprovalModalProps) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-nova-gray-900/20"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Fechar"
      />
      <DsApprovalPopup
        title="Registro de clientes"
        subtitle="Solicitação de novo cadastro de cliente"
        entityName={client.name}
        status={PENDING_STATUS}
        details={buildDetails(client)}
        rejectLabel="Reprovar cadastro"
        approveLabel="Aprovar cadastro"
        onReject={onReject}
        onApprove={onApprove}
        onClose={onClose}
        className="relative w-full max-w-150 shadow-lg shadow-nova-gray-300/10"
      />
    </div>
  );
}

export { ClientApprovalModal, type ClientApprovalModalProps };
