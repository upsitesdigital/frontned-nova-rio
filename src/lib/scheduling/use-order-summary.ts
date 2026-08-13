import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { PaymentConfig } from "@/config/payment";
import { Messages } from "@/lib/core/messages";
import { Formatters } from "@/lib/formatting/formatters";
import { SchedulingPricing } from "@/lib/pricing/scheduling-pricing";
import type { DsOrderSummaryProps, DsOrderSummaryRow } from "@/design-system";
import { usePaymentStore } from "@/stores/scheduling/payment-store";
import { useSchedulingStore } from "@/stores/scheduling/scheduling-store";
import { useServicesStore } from "@/stores/client/services-store";

/**
 * Binds the scheduling/services/payment stores to the props of `DsOrderSummary`.
 * Shared by the public and authenticated booking flows; only the confirmation
 * route differs.
 */
export function useOrderSummary(confirmationPath: string): DsOrderSummaryProps {
  const router = useRouter();

  const services = useServicesStore((s) => s.services);
  const selectedServiceId = useServicesStore((s) => s.selectedServiceId);
  const loadServices = useServicesStore((s) => s.loadServices);

  const paymentMethod = usePaymentStore((s) => s.paymentMethod);
  const isSubmitting = usePaymentStore((s) => s.isSubmitting);
  const submitError = usePaymentStore((s) => s.submitError);
  const pay = usePaymentStore((s) => s.pay);

  const recurrenceType = useSchedulingStore((s) => s.recurrenceType);
  const recurrenceFrequency = useSchedulingStore((s) => s.recurrenceFrequency);
  const weeklyFrequency = useSchedulingStore((s) => s.weeklyFrequency);

  useEffect(() => {
    if (services.length === 0) {
      loadServices();
    }
  }, [services.length, loadServices]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

  useEffect(() => {
    if (services.length > 0 && (!selectedService || recurrenceType === null)) {
      router.replace(
        confirmationPath.includes("dashboard")
          ? "/dashboard/agendamento/servico"
          : "/agendamento/servico",
      );
    }
  }, [confirmationPath, recurrenceType, router, selectedService, services.length]);

  const { subtotal, discount, total } = useMemo(
    () =>
      SchedulingPricing.calculate({
        basePrice: selectedService?.basePrice ?? 0,
        recurrenceType,
        recurrenceFrequency,
        weeklyFrequency,
        serviceFee: PaymentConfig.serviceFee,
      }),
    [selectedService, recurrenceType, recurrenceFrequency, weeklyFrequency],
  );

  const recurrenceLabel =
    recurrenceType === "avulso"
      ? "Avulso — 1 visita"
      : recurrenceType === "pacote"
        ? "Pacote"
        : recurrenceFrequency === "semanal"
          ? `${weeklyFrequency}x por semana — ${weeklyFrequency === 1 ? 4 : weeklyFrequency === 2 ? 8 : weeklyFrequency === 3 ? 13 : weeklyFrequency === 4 ? 17 : 21} visitas/mês`
          : recurrenceFrequency === "quinzenal"
            ? `${weeklyFrequency} visita${weeklyFrequency === 1 ? "" : "s"} por quinzena — ${weeklyFrequency * 2} visitas/mês`
            : `${weeklyFrequency} visita${weeklyFrequency === 1 ? "" : "s"} por mês`;

  const handlePay = useCallback(async () => {
    const success = await pay();
    if (success) {
      router.push(confirmationPath);
    }
  }, [pay, router, confirmationPath]);

  const rows: DsOrderSummaryRow[] = [
    { label: "Recorrência", value: recurrenceLabel },
    { label: Messages.orderSummary.subtotal, value: Formatters.formatCurrency(subtotal) },
    ...(discount > 0
      ? [
          {
            label: Messages.orderSummary.discount,
            value: `-${Formatters.formatCurrency(discount)}`,
            emphasis: "success" as const,
          },
        ]
      : []),
    {
      label: Messages.orderSummary.serviceFee,
      value: Formatters.formatCurrency(PaymentConfig.serviceFee),
    },
  ];

  return {
    title: Messages.orderSummary.title,
    serviceLabel: Messages.orderSummary.service,
    serviceName: selectedService?.name ?? Messages.orderSummary.emptyService,
    rows,
    totalLabel: Messages.orderSummary.total,
    totalValue: Formatters.formatCurrency(total),
    payLabel: isSubmitting
      ? Messages.orderSummary.processing
      : `${Messages.orderSummary.pay} ${Formatters.formatCurrency(total)}`,
    termsText: Messages.orderSummary.terms,
    payDisabled: paymentMethod === null || isSubmitting || selectedService === null,
    errorText: submitError,
    onPay: handlePay,
  };
}
