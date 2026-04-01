"use client";

import {
  CurrencyDollarSimpleIcon,
  UsersThreeIcon,
  ClockIcon,
} from "@phosphor-icons/react/dist/ssr";
import { DsCard, DsIcon } from "@/design-system";
import { useAdminReportsStore } from "@/stores/admin-reports-store";

const numberFormatter = new Intl.NumberFormat("pt-BR");

function formatHours(value: number): string {
  if (!Number.isFinite(value)) return "0h";
  const rounded = Number.isInteger(value) ? value : Number(value.toFixed(1));
  return `${numberFormatter.format(rounded)}h`;
}

function ReportsSummaryCards() {
  const { summary, activeClientsTotal, totalHoursSold, isLoading } = useAdminReportsStore();

  const cards = [
    {
      label: "Vendas consluídas",
      value: numberFormatter.format(summary?.totalPayments ?? 0),
      footer: "no último mês",
      icon: CurrencyDollarSimpleIcon,
      iconClassName: "text-nova-primary-dark",
      iconWrapperClassName: "bg-nova-primary-light",
      valueClassName: "text-nova-primary-dark",
      valueGapClassName: "gap-2",
    },
    {
      label: "Total de clientes ativos",
      value: numberFormatter.format(activeClientsTotal),
      icon: UsersThreeIcon,
      iconClassName: "text-nova-purple",
      iconWrapperClassName: "bg-nova-purple-light",
      valueClassName: "text-nova-purple",
      valueGapClassName: "gap-4",
    },
    {
      label: "Horas vendidas por serviço",
      value: formatHours(totalHoursSold),
      icon: ClockIcon,
      iconClassName: "text-nova-warning",
      iconWrapperClassName: "bg-nova-warning-lighter",
      valueClassName: "text-nova-warning",
      valueGapClassName: "gap-4",
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => (
        <DsCard
          key={card.label}
          className="rounded-[10px] border-nova-gray-100 bg-white p-10"
        >
          <div className="flex w-full items-center">
            <span className="text-[20px] font-medium leading-[1.3] text-black">{card.label}</span>
          </div>

          <div className={`mt-6 flex items-center ${card.valueGapClassName}`}>
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${card.iconWrapperClassName}`}
            >
              <DsIcon icon={card.icon} size="lg" className={card.iconClassName} />
            </div>
            <strong
              className={`text-[48px] font-medium leading-none tracking-[-1.92px] ${card.valueClassName}`}
            >
              {isLoading && !summary ? "..." : card.value}
            </strong>
            {card.footer ? (
              <span className="text-sm font-normal leading-normal text-nova-gray-700">{card.footer}</span>
            ) : null}
          </div>
        </DsCard>
      ))}
    </div>
  );
}

export { ReportsSummaryCards };