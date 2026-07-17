"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr";

import {
  DsButton,
  DsEmptyState,
  DsFlowCard,
  DsFlowHeader,
  DsRecurrenceConfig,
  DsServiceOptionCard,
  DsSkeleton,
} from "@/design-system";
import { SchedulingConfig } from "@/config/scheduling";
import { Messages } from "@/lib/core/messages";
import { Formatters } from "@/lib/formatting/formatters";
import { IconMap } from "@/lib/display/icon-map";
import { useSchedulingStore } from "@/stores/scheduling/scheduling-store";
import { useServicesStore } from "@/stores/client/services-store";
import type { RecurrenceFrequency, RecurrenceType } from "@/types/scheduling";

export default function ServicoPage() {
  const router = useRouter();

  const services = useServicesStore((s) => s.services);
  const isLoadingServices = useServicesStore((s) => s.isLoadingServices);
  const servicesError = useServicesStore((s) => s.error);
  const selectedServiceId = useServicesStore((s) => s.selectedServiceId);
  const loadServices = useServicesStore((s) => s.loadServices);
  const setSelectedServiceId = useServicesStore((s) => s.setSelectedServiceId);

  const recurrenceType = useSchedulingStore((s) => s.recurrenceType);
  const recurrenceFrequency = useSchedulingStore((s) => s.recurrenceFrequency);
  const weeklyFrequency = useSchedulingStore((s) => s.weeklyFrequency);
  const setRecurrenceType = useSchedulingStore((s) => s.setRecurrenceType);
  const setRecurrenceFrequency = useSchedulingStore((s) => s.setRecurrenceFrequency);
  const setWeeklyFrequency = useSchedulingStore((s) => s.setWeeklyFrequency);

  useEffect(() => {
    if (services.length === 0) {
      loadServices();
    }
  }, [services.length, loadServices]);

  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;

  const availableRecurrenceOptions = selectedService
    ? SchedulingConfig.recurrenceOptions.filter((opt) => selectedService[opt.field])
    : SchedulingConfig.recurrenceOptions;

  const canProceed =
    selectedServiceId !== null &&
    recurrenceType !== null &&
    (recurrenceType !== "recorrencia" || recurrenceFrequency !== null);

  return (
    <DsFlowCard className="mx-auto max-w-252">
      <DsFlowHeader
        title="Agendar serviço"
        subtitle="Selecione o tipo de serviço e a duração desejada."
      />

      {isLoadingServices ? (
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <DsSkeleton className="h-55 flex-1 rounded-[10px]" />
          <DsSkeleton className="h-55 flex-1 rounded-[10px]" />
          <DsSkeleton className="h-55 flex-1 rounded-[10px]" />
        </div>
      ) : servicesError ? (
        <DsEmptyState
          title={Messages.services.loadErrorTitle}
          message={servicesError}
          actionLabel={Messages.services.retry}
          actionIcon={ArrowClockwise}
          onAction={loadServices}
        />
      ) : (
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          {services.map((service) => (
            <DsServiceOptionCard
              key={service.id}
              icon={IconMap.getServiceIcon(service.icon)}
              title={service.name}
              description={service.description ?? ""}
              price={Formatters.formatPrice(service.basePrice)}
              selected={selectedServiceId === service.id}
              onClick={() => setSelectedServiceId(service.id)}
            />
          ))}
        </div>
      )}

      <DsRecurrenceConfig
        title="Configurar Recorrência"
        subtitle="Escolha como deseja agendar seus serviços de limpeza"
        options={availableRecurrenceOptions}
        selectedType={recurrenceType}
        onSelectType={(type) => setRecurrenceType(type as RecurrenceType)}
        selectPlaceholder="Selecione..."
        showFrequency={recurrenceType === "recorrencia"}
        frequencyLabel="Selecione o tipo de recorrência"
        frequencyOptions={SchedulingConfig.frequencyOptions}
        frequencyValue={recurrenceFrequency ?? "mensal"}
        onFrequencyChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)}
        showWeeklyTimes={recurrenceFrequency === "semanal"}
        weeklyTimesLabel="Quantas vezes por semana?"
        weeklyTimesOptions={SchedulingConfig.weeklyTimesOptions}
        weeklyTimesValue={String(weeklyFrequency)}
        onWeeklyTimesChange={(value) => setWeeklyFrequency(Number(value))}
        discountNote={
          <>
            <span className="font-bold">5%</span> de desconto para recorrências mensais e{" "}
            <span className="font-bold">10%</span> para semanais e quinzenais.
          </>
        }
      />

      <DsButton
        size="flow"
        disabled={!canProceed}
        onClick={() => router.push("/agendamento/dia-horario")}
        className="w-64.25"
      >
        Continuar
      </DsButton>
    </DsFlowCard>
  );
}
