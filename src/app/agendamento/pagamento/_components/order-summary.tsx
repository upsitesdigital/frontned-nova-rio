"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { DsButton, DsSeparator } from "@/design-system";
import { SERVICE_FEE } from "@/config/payment";
import { formatCurrency } from "@/lib/formatters";
import { usePaymentStore } from "@/stores/payment-store";
import { useServicesStore } from "@/stores/services-store";

function OrderSummary() {
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

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

  const subtotal = selectedService?.basePrice ?? 0;
  const total = subtotal + SERVICE_FEE;

  const handlePay = useCallback(async () => {
    const success = await pay();
    if (success) {
      router.push("/agendamento/confirmacao");
    }
  }, [pay, router]);

  return (
    <div className="w-[502px] shrink-0 rounded-2xl border border-nova-gray-300 px-10 py-12">
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
            <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">Taxa de serviço</span>
            <span className="font-medium text-black">{formatCurrency(SERVICE_FEE)}</span>
          </div>
        </div>

        <DsSeparator />

        <div className="flex items-center justify-between text-xl font-medium leading-[1.3] tracking-[-0.8px] text-black">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <div className="flex flex-col gap-4">
          <DsButton
            size="flow"
            className="w-full"
            disabled={paymentMethod === null || isSubmitting}
            onClick={handlePay}
          >
            {isSubmitting ? "Processando..." : `Pagar ${formatCurrency(total)}`}
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

export { OrderSummary };
