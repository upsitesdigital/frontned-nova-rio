"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { DsButton, DsSeparator } from "@/design-system";
import { PaymentConfig } from "@/config/payment";
import { Formatters } from "@/lib/formatting/formatters";
import { SchedulingPricing } from "@/lib/pricing/scheduling-pricing";
import { usePaymentStore } from "@/stores/scheduling/payment-store";
import { useSchedulingStore } from "@/stores/scheduling/scheduling-store";
import { useServicesStore } from "@/stores/client/services-store";

export function OrderSummary() {
  const router = useRouter();
  const services = useServicesStore((s) => s.services);
  const selectedServiceId = useServicesStore((s) => s.selectedServiceId);
  const loadServices = useServicesStore((s) => s.loadServices);

  useEffect(() => {
    if (services.length === 0) {
      loadServices();
    }
  }, [services.length, loadServices]);
  const paymentMethod = usePaymentStore((s) => s.paymentMethod);
  const isSubmitting = usePaymentStore((s) => s.isSubmitting);
  const submitError = usePaymentStore((s) => s.submitError);
  const pay = usePaymentStore((s) => s.pay);

  const recurrenceType = useSchedulingStore((s) => s.recurrenceType);
  const recurrenceFrequency = useSchedulingStore((s) => s.recurrenceFrequency);
  const weeklyFrequency = useSchedulingStore((s) => s.weeklyFrequency);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

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

  const handlePay = useCallback(async () => {
    const success = await pay();
    if (success) {
      router.push("/agendamento/confirmacao");
    }
  }, [pay, router]);

  return (
    <div className="w-full shrink-0 rounded-2xl border border-nova-gray-300 px-6 py-10 sm:px-10 sm:py-12 lg:w-125.5">
      <div className="flex flex-col gap-8">
        <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
          Resumo do pedido
        </h3>

        <div className="flex flex-col gap-6 text-base leading-[1.3]">
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">Serviço</span>
            <span className="font-medium text-black">{selectedService?.name ?? "---"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">Subtotal</span>
            <span className="font-medium text-black">{Formatters.formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-nova-gray-700">Desconto</span>
              <span className="font-medium text-nova-success">
                -{Formatters.formatCurrency(discount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">Taxa de serviço</span>
            <span className="font-medium text-black">
              {Formatters.formatCurrency(PaymentConfig.serviceFee)}
            </span>
          </div>
        </div>

        <DsSeparator />

        <div className="flex items-center justify-between text-xl font-medium leading-[1.3] tracking-[-0.8px] text-black">
          <span>Total</span>
          <span>{Formatters.formatCurrency(total)}</span>
        </div>

        <div className="flex flex-col gap-4">
          <DsButton
            size="flow"
            className="w-full"
            disabled={paymentMethod === null || isSubmitting}
            onClick={handlePay}
          >
            {isSubmitting ? "Processando..." : `Pagar ${Formatters.formatCurrency(total)}`}
          </DsButton>
          {submitError && (
            <p className="text-center text-sm leading-[1.3] text-nova-error">{submitError}</p>
          )}
          <p className="text-center text-sm leading-[1.3] text-nova-gray-700">
            Ao confirmar o pagamento, você concorda com nossos termos de serviço
          </p>
        </div>
      </div>
    </div>
  );
}
