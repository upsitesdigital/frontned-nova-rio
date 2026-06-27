"use client";

import {
  DsFilterDropdown,
  DsTransactionCard,
  DsTransactionTable,
  DsPaymentStatusPill,
  DsReceiptButton,
  DsRecordCard,
  DsEmptyState,
  type DsTransactionTableColumn,
} from "@/design-system";
import { PaymentFormat } from "@/lib/formatting/payment-format";
import { DateHelpers } from "@/lib/formatting/date-helpers";
import { usePaymentsPageStore, type FilterValue } from "@/stores/client/payments-page-store";

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

export function PaymentsHistoryPanel() {
  const { payments, filter, setFilter, downloadReceipt } = usePaymentsPageStore();

  const sortedPayments = PaymentFormat.sortPaymentsByStatus(payments);

  const tableData = sortedPayments.map((payment) => ({
    date: (
      <span className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
        {DateHelpers.formatDate(payment.appointment.date)}
      </span>
    ),
    service: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {payment.appointment.service.name}
      </span>
    ),
    method: (
      <span className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
        {PaymentFormat.formatPaymentMethod(payment)}
      </span>
    ),
    status: <DsPaymentStatusPill status={payment.status} />,
    value: (
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
        {PaymentFormat.formatPaymentAmount(payment.amount)}
      </span>
    ),
    receipt: (
      <DsReceiptButton
        label="Baixar"
        disabled={payment.status !== "APPROVED"}
        onClick={() => downloadReceipt(payment.id)}
      />
    ),
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
      <div className="hidden lg:block">
        <DsTransactionTable
          columns={columns}
          data={tableData}
          emptyMessage="Nenhuma transação encontrada."
        />
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {sortedPayments.length === 0 ? (
          <DsEmptyState
            message="Nenhuma transação encontrada."
            className="rounded-md bg-white p-4"
          />
        ) : (
          sortedPayments.map((payment) => (
            <DsRecordCard
              key={payment.id}
              title={payment.appointment.service.name}
              status={<DsPaymentStatusPill status={payment.status} />}
              fields={[
                { label: "Data", value: DateHelpers.formatDate(payment.appointment.date) },
                { label: "Método", value: PaymentFormat.formatPaymentMethod(payment) },
                { label: "Valor", value: PaymentFormat.formatPaymentAmount(payment.amount) },
              ]}
              actions={
                <DsReceiptButton
                  label="Baixar"
                  disabled={payment.status !== "APPROVED"}
                  onClick={() => downloadReceipt(payment.id)}
                />
              }
            />
          ))
        )}
      </div>
    </DsTransactionCard>
  );
}
