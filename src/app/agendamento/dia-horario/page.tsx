"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { DsButton, DsFlowCard, DsFlowHeader, DsFormField, DsInput } from "@/design-system";
import { DsDateTimePicker } from "@/design-system/composite/ds-date-time-picker";
import { DsSkeleton } from "@/design-system";
import { useSchedulingStore } from "@/stores/scheduling-store";

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function DiaHorarioPage() {
  const router = useRouter();

  const selectedDate = useSchedulingStore((s) => s.selectedDate);
  const selectedTime = useSchedulingStore((s) => s.selectedTime);
  const timeSlots = useSchedulingStore((s) => s.timeSlots);
  const cep = useSchedulingStore((s) => s.cep);
  const address = useSchedulingStore((s) => s.address);
  const isLoadingAddress = useSchedulingStore((s) => s.isLoadingAddress);
  const cepError = useSchedulingStore((s) => s.cepError);

  const setSelectedDate = useSchedulingStore((s) => s.setSelectedDate);
  const setSelectedTime = useSchedulingStore((s) => s.setSelectedTime);
  const loadTimeSlots = useSchedulingStore((s) => s.loadTimeSlots);
  const setCep = useSchedulingStore((s) => s.setCep);
  const loadAddressByCep = useSchedulingStore((s) => s.loadAddressByCep);
  const clearAddress = useSchedulingStore((s) => s.clearAddress);

  const allSlots = useMemo(() => timeSlots.map((slot) => slot.time), [timeSlots]);

  const disabledSlots = useMemo(
    () => timeSlots.filter((slot) => !slot.available).map((slot) => slot.time),
    [timeSlots],
  );

  const disabledDays = useMemo(() => ({ dayOfWeek: [0, 6] }), []);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, loadTimeSlots]);

  useEffect(() => {
    if (selectedTime && timeSlots.length > 0) {
      const slot = timeSlots.find((s) => s.time === selectedTime);
      if (!slot || !slot.available) {
        setSelectedTime(null);
      }
    }
  }, [timeSlots, selectedTime, setSelectedTime]);

  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date ?? null);
    },
    [setSelectedDate],
  );

  const handleTimeChange = useCallback(
    (time: string) => {
      setSelectedTime(time);
    },
    [setSelectedTime],
  );

  const handleCepChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCep(e.target.value);
      setCep(formatted);

      const digits = formatted.replace(/\D/g, "");
      if (digits.length === 8) {
        loadAddressByCep(formatted);
      } else {
        clearAddress();
      }
    },
    [setCep, loadAddressByCep, clearAddress],
  );

  const handleCancel = useCallback(() => {
    setSelectedDate(null);
    setSelectedTime(null);
  }, [setSelectedDate, setSelectedTime]);

  const canProceed = selectedDate !== null && selectedTime !== null && address !== null;

  return (
    <DsFlowCard>
      <DsFlowHeader title="Dia, horário e local da limpeza" />

      <div className="flex w-full items-start gap-16">
        <div className="shrink-0">
          <DsDateTimePicker
            date={selectedDate ?? undefined}
            time={selectedTime ?? undefined}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            onCancel={handleCancel}
            showActions={false}
            timeSlots={allSlots.length > 0 ? allSlots : undefined}
            disabledSlots={disabledSlots}
            disabledDays={disabledDays}
          />
        </div>

        <div className="flex w-full flex-col gap-[15px]">
          <h3 className="text-xl font-medium leading-[1.3] text-nova-gray-700">Local da Limpeza</h3>

          <DsFormField label="CEP" error={cepError ?? undefined}>
            <DsInput
              placeholder="Digite seu CEP"
              value={cep}
              onChange={handleCepChange}
              className="rounded-[6px] border-nova-gray-500 px-4 py-3 text-base leading-normal tracking-[-0.64px] shadow-none data-[size=default]:h-auto"
            />
          </DsFormField>

          {isLoadingAddress && (
            <div className="flex flex-col gap-2">
              <DsSkeleton className="h-4 w-3/4" />
              <DsSkeleton className="h-4 w-1/2" />
            </div>
          )}

          {address && !isLoadingAddress && (
            <div className="flex flex-col gap-1 text-sm leading-[1.4] text-nova-gray-700">
              <p>{address.street}</p>
              <p>{address.neighborhood}</p>
              <p>
                {address.city} - {address.state}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full justify-between">
        <DsButton
          variant="outline"
          size="flow"
          onClick={() => router.push("/agendamento/servico")}
          className="w-[257px] border-nova-gray-500 text-nova-gray-700"
        >
          Voltar
        </DsButton>
        <DsButton
          size="flow"
          disabled={!canProceed}
          onClick={() => router.push("/agendamento/cadastro")}
          className="w-[257px]"
        >
          Continuar
        </DsButton>
      </div>
    </DsFlowCard>
  );
}
