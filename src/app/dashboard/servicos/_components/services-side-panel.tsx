"use client";

import { useState } from "react";
import {
  DsUpcomingServiceCard,
  DsHighlightCard,
  DsRecurrenceCard,
  DsSelect,
} from "@/design-system";

interface ServicesSidePanelProps {
  nextServiceDate: string;
  nextServiceSubtitle: string;
  appointmentsCount: number;
  appointmentsLabel: string;
  hasNextService: boolean;
  onReschedule?: () => void;
  onCancel?: () => void;
  onReceipt?: () => void;
}

const recurrenceOptions = [
  { value: "monthly", label: "Mensal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "weekly", label: "Semanal" },
];

function ServicesSidePanel({
  nextServiceDate,
  nextServiceSubtitle,
  appointmentsCount,
  appointmentsLabel,
  hasNextService,
  onReschedule,
  onCancel,
  onReceipt,
}: ServicesSidePanelProps) {
  const [recurrenceType, setRecurrenceType] = useState("monthly");

  return (
    <div className="flex w-125 shrink-0 flex-col gap-4">
      <DsUpcomingServiceCard
        date={nextServiceDate}
        subtitle={nextServiceSubtitle}
        onReceipt={onReceipt}
        receiptDisabled={!hasNextService}
        actions={[
          { label: "Reagendar", variant: "filled", onClick: onReschedule },
          { label: "Cancelar", variant: "outlined", onClick: onCancel },
        ]}
      />

      <DsHighlightCard
        title="Agendamentos"
        value={String(appointmentsCount)}
        subtitle={appointmentsLabel}
        valueColor="text-nova-primary-dark"
      />

      <DsRecurrenceCard
        title="Configurar Recorrência"
        description="Escolha como deseja configurar a recorrência dos serviços"
      >
        <div className="flex flex-col gap-1.5">
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            Selecione o tipo de recorrência
          </p>
          <DsSelect
            options={recurrenceOptions}
            value={recurrenceType}
            onValueChange={setRecurrenceType}
            className="w-full gap-1 rounded-md border-nova-gray-100 bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-[#4d4d4f] shadow-none data-[size=default]:h-auto"
          />
        </div>
        <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
          <span className="font-bold">5%</span> de desconto para recorrências mensais e{" "}
          <span className="font-bold">10%</span> para semanais e quinzenais.
        </p>
      </DsRecurrenceCard>
    </div>
  );
}

export { ServicesSidePanel, type ServicesSidePanelProps };
