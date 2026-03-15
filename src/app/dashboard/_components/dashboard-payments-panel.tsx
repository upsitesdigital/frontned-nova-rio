import { CreditCardIcon, CodeIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsRegisteredCardItem,
  DsRecentPaymentItem,
  DsSeparator,
  DsEmptyState,
} from "@/design-system";
import type { RegisteredCard, RecentPayment } from "@/types/payment";

interface DashboardPaymentsPanelProps {
  cards: RegisteredCard[];
  payments: RecentPayment[];
  paymentsMonthLabel: string;
  onEditCard?: (id: number) => void;
}

const paymentIcons = {
  card: CreditCardIcon,
  pix: CodeIcon,
} as const;

function DashboardPaymentsPanel({
  cards,
  payments,
  paymentsMonthLabel,
  onEditCard,
}: DashboardPaymentsPanelProps) {
  return (
    <div className="flex flex-col gap-6 overflow-clip rounded-4xl border border-nova-gray-100 bg-white px-6 py-8">
      <p className="text-xl font-medium leading-[1.3] text-black">Cartões cadastrados</p>

      <div className="flex flex-col gap-2">
        {cards.length === 0 ? (
          <DsEmptyState message="Nenhum cartão cadastrado." className="py-4" />
        ) : (
          cards.map((card) => (
            <DsRegisteredCardItem
              key={card.id}
              brandSrc={card.brandSrc}
              lastDigits={card.lastDigits}
              expiry={card.expiry}
              actionLabel="Editar"
              onAction={onEditCard ? () => onEditCard(card.id) : undefined}
            />
          ))
        )}
      </div>

      <DsSeparator />

      <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-black">
        Pagamentos recentes
      </p>

      <div className="flex flex-col gap-4">
        <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
          {paymentsMonthLabel}
        </p>
        {payments.length === 0 ? (
          <DsEmptyState message="Nenhum pagamento recente." className="py-4" />
        ) : (
          <div className="flex flex-col gap-4">
            {payments.map((payment) => (
              <DsRecentPaymentItem
                key={payment.id}
                icon={paymentIcons[payment.method]}
                method={payment.methodLabel}
                service={payment.service}
                amount={payment.amount}
                status={payment.status}
                statusLabel={payment.statusLabel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export {
  DashboardPaymentsPanel,
  type DashboardPaymentsPanelProps,
};
