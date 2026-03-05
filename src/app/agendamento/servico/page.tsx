"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  DsButton,
  DsFlowCard,
  DsFlowHeader,
  DsRadioOptionCard,
  DsSelect,
  DsServiceOptionCard,
  DsSkeleton,
  type DsSelectOption,
} from "@/design-system";
import { getServiceIcon } from "@/lib/icon-map";
import { useSchedulingStore } from "@/stores/scheduling-store";
import type { RecurrenceFrequency, RecurrenceType } from "@/types/scheduling";
import type { Service } from "@/types/service";

interface RecurrenceOption {
  type: RecurrenceType;
  label: string;
  badge?: string;
  field: keyof Pick<Service, "allowSingle" | "allowPackage" | "allowRecurrence">;
}

const RECURRENCE_OPTIONS: RecurrenceOption[] = [
  { type: "avulso", label: "Avulso", field: "allowSingle" },
  { type: "pacote", label: "Pacote", field: "allowPackage" },
  { type: "recorrencia", label: "Recorrência", badge: "5% OFF", field: "allowRecurrence" },
];

const FREQUENCY_OPTIONS: DsSelectOption[] = [
  { value: "semanal", label: "Semanal" },
  { value: "quinzenal", label: "Quinzenal" },
  { value: "mensal", label: "Mensal" },
];

function formatPrice(price: number): string {
  return `A partir de R$ ${price.toFixed(2).replace(".", ",")}`;
}

export default function ServicoPage() {
  const router = useRouter();
  const services = useSchedulingStore((s) => s.services);
  const isLoadingServices = useSchedulingStore((s) => s.isLoadingServices);
  const selectedServiceId = useSchedulingStore((s) => s.selectedServiceId);
  const recurrenceType = useSchedulingStore((s) => s.recurrenceType);
  const loadServices = useSchedulingStore((s) => s.loadServices);
  const setSelectedServiceId = useSchedulingStore((s) => s.setSelectedServiceId);
  const recurrenceFrequency = useSchedulingStore((s) => s.recurrenceFrequency);
  const setRecurrenceType = useSchedulingStore((s) => s.setRecurrenceType);
  const setRecurrenceFrequency = useSchedulingStore((s) => s.setRecurrenceFrequency);

  useEffect(() => {
    if (services.length === 0) {
      loadServices();
    }
  }, [services.length, loadServices]);

  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;

  const availableRecurrenceOptions = selectedService
    ? RECURRENCE_OPTIONS.filter((opt) => selectedService[opt.field])
    : RECURRENCE_OPTIONS;

  const canProceed =
    selectedServiceId !== null &&
    recurrenceType !== null &&
    (recurrenceType !== "recorrencia" || recurrenceFrequency !== null);

  return (
    <DsFlowCard>
      <DsFlowHeader
        title="Agendar serviço"
        subtitle="Selecione o tipo de serviço e a duração desejada."
      />

      {isLoadingServices || services.length === 0 ? (
        <div className="flex w-full gap-4">
          <DsSkeleton className="h-[220px] flex-1 rounded-[10px]" />
          <DsSkeleton className="h-[220px] flex-1 rounded-[10px]" />
          <DsSkeleton className="h-[220px] flex-1 rounded-[10px]" />
        </div>
      ) : (
        <div className="flex w-full gap-4">
          {services.map((service) => (
            <DsServiceOptionCard
              key={service.id}
              icon={getServiceIcon(service.icon)}
              title={service.name}
              description={service.description ?? ""}
              price={formatPrice(service.basePrice)}
              selected={selectedServiceId === service.id}
              onClick={() => setSelectedServiceId(service.id)}
            />
          ))}
        </div>
      )}

      <div className="flex w-full flex-col gap-8 rounded-2xl border border-nova-gray-300 px-10 py-12">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
            Configurar Recorrência
          </h3>
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            Escolha como deseja agendar seus serviços de limpeza
          </p>
        </div>

        <div className="flex gap-3">
          {availableRecurrenceOptions.map((option) => (
            <DsRadioOptionCard
              key={option.type}
              label={option.label}
              badge={option.badge}
              selected={recurrenceType === option.type}
              onClick={() => setRecurrenceType(option.type)}
            />
          ))}
        </div>

        {recurrenceType === "recorrencia" && (
          <div className="flex w-full flex-col gap-4 rounded-[10px] bg-nova-gray-50 p-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                Selecione o tipo de recorrência
              </p>
              <DsSelect
                options={FREQUENCY_OPTIONS}
                value={recurrenceFrequency ?? "mensal"}
                onValueChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)}
                placeholder="Selecione..."
                className="w-full rounded-[6px] border-[#efefef] bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-[#4d4d4f] shadow-none data-[size=default]:h-auto [&_svg]:size-5 [&_svg]:opacity-100"
              />
            </div>
            <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
              <span className="font-bold">5%</span> de desconto para recorrências mensais e{" "}
              <span className="font-bold">10%</span> para semanais e quinzenais.
            </p>
          </div>
        )}
      </div>

      <DsButton
        size="flow"
        disabled={!canProceed}
        onClick={() => router.push("/agendamento/dia-horario")}
        className="w-[257px]"
      >
        Continuar
      </DsButton>
    </DsFlowCard>
  );
}
