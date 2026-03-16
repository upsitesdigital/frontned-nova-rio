"use client";

import { format } from "date-fns";

import {
  DsFilterDropdown,
  DsTransactionCard,
  DsTransactionTable,
  DsPaymentStatusPill,
  DsReceiptButton,
  type DsTransactionTableColumn,
} from "@/design-system";
import {
  sortPaymentsByStatus,
  formatPaymentMethod,
  formatPaymentAmount,
} from "@/lib/payment-format";
import { usePaymentsPageStore, type FilterValue } from "@/stores/payments-page-store";

const filterOptions = [
  { value: "ALL", label: "Todos" },
  { value: "APPROVED", label: "Aprovado" },
  { value: "PENDING", label: "Pendente" },
  { value: "CANCELLED", label: "Cancelado" },
];

const columns: DsTransactionTableColumn[] = [
  { key: "date", header: "Data" },
  { key: "service", header: "Serviço" },
  { key: "method", header: "Método" },
  { key: "status", header: "Status" },
  { key: "value", header: "Valor" },
  { key: "receipt", header: "Recibo" },
];

function PaymentsHistoryPanel() {
  const { payments, filter, setFilter } = usePaymentsPageStore();

  const tableData = sortPaymentsByStatus(payments).map((payment) => ({
    date: (
      <span className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
        {format(new Date(payment.appointment.date), "dd/MM/yyyy")}
      </span>
    ),
    service: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {payment.appointment.service.name}
      </span>
    ),
    method: (
      <span className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
        {formatPaymentMethod(payment)}
      </span>
    ),
    status: <DsPaymentStatusPill status={payment.status} />,
    value: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {formatPaymentAmount(payment.amount)}
      </span>
    ),
    receipt: <DsReceiptButton disabled={payment.status !== "APPROVED"} />,
  }));

  return (
    <DsTransactionCard
      title="Histórico completo de transações"
      action={
        <DsFilterDropdown
          label="Filtrar por"
          options={filterOptions}
          value={filter}
          onValueChange={(value) => setFilter(value as FilterValue)}
          placeholder="Todos"
        />
      }
    >
      <DsTransactionTable
        columns={columns}
        data={tableData}
        emptyMessage="Nenhuma transação encontrada."
      />
    </DsTransactionCard>
  );
}

export { PaymentsHistoryPanel };
