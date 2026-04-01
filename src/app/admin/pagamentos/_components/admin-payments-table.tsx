"use client";

import { format } from "date-fns";
import { EyeIcon, PencilSimpleLineIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsIconButton,
  DsLoadingState,
  DsPaymentStatusPill,
  DsTransactionTable,
  type DsTransactionTableColumn,
} from "@/design-system";
import { formatPaymentAmount } from "@/lib/payment-format";
import { useAdminPaymentsStore } from "@/stores/admin-payments-store";

const COLUMNS: DsTransactionTableColumn[] = [
  { key: "date", header: "Data", className: "max-w-28" },
  { key: "service", header: "Serviço" },
  { key: "client", header: "Cliente" },
  { key: "method", header: "Método", className: "max-w-52" },
  { key: "status", header: "Status", className: "max-w-40" },
  { key: "value", header: "Valor", className: "max-w-32" },
  { key: "package", header: "Pacote", className: "max-w-31.5" },
  { key: "actions", header: "Ações", className: "max-w-20 justify-end" },
];

function getMethodLabel(method: "CREDIT_CARD" | "DEBIT_CARD" | "PIX", cardLastDigits?: string) {
  if (method === "PIX") {
    return "Pix";
  }

  const digits = cardLastDigits ?? "0000";
  return `Cartão •••• ${digits}`;
}

function getRecurrenceLabel(recurrenceType: "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY") {
  if (recurrenceType === "SINGLE") return "Avulso";
  if (recurrenceType === "PACKAGE") return "Pacote";
  if (recurrenceType === "WEEKLY") return "Semanal";
  if (recurrenceType === "BIWEEKLY") return "Quinzenal";
  return "Mensal";
}

function formatTransactionDate(dateIso: string) {
  const parsed = new Date(dateIso);
  if (Number.isNaN(parsed.getTime())) {
    return "--/--/----";
  }

  return format(parsed, "dd/MM/yyyy");
}

function AdminPaymentsTable() {
  const { payments, isLoading, openDetails } = useAdminPaymentsStore();

  if (isLoading) {
    return <DsLoadingState message="Carregando pagamentos..." className="py-16" />;
  }

  const rows = payments.map((payment) => ({
    date: (
      <span className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
        {formatTransactionDate(payment.paidAt ?? payment.createdAt)}
      </span>
    ),
    client: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {payment.client.name}
      </span>
    ),
    service: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {payment.appointment.service.name}
      </span>
    ),
    method: (
      <span className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
        {getMethodLabel(payment.method, payment.card?.lastFourDigits)}
      </span>
    ),
    status: <DsPaymentStatusPill status={payment.status} />,
    value: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {formatPaymentAmount(payment.amount)}
      </span>
    ),
    package: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {getRecurrenceLabel(payment.appointment.recurrenceType)}
      </span>
    ),
    actions: (
      <div className="flex items-center justify-end gap-4">
        <DsIconButton
          icon={EyeIcon}
          iconSize="md"
          variant="ghost"
          size="icon-sm"
          ariaLabel={`Visualizar pagamento ${payment.id}`}
          onClick={() => openDetails(payment.id)}
          className="text-nova-gray-700 hover:bg-transparent hover:text-black"
        />
        <DsIconButton
          icon={PencilSimpleLineIcon}
          iconSize="md"
          variant="ghost"
          size="icon-sm"
          ariaLabel={`Editar pagamento ${payment.id}`}
          onClick={() => openDetails(payment.id)}
          className="text-nova-gray-700 hover:bg-transparent hover:text-black"
        />
      </div>
    ),
  }));

  return (
    <DsTransactionTable columns={COLUMNS} data={rows} emptyMessage="Nenhuma transação encontrada." />
  );
}

export { AdminPaymentsTable };
