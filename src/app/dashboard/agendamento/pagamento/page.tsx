"use client";

import { DsFlowHeader, DsPaymentMethodOption, DsSecurePaymentBanner } from "@/design-system";
import { PAYMENT_METHODS } from "@/config/payment";
import { usePaymentStore } from "@/stores/payment-store";

import { BillingInfo } from "@/app/agendamento/pagamento/_components/billing-info";
import { CardDetails } from "@/app/agendamento/pagamento/_components/card-details";
import { DashboardOrderSummary } from "./_components/order-summary-dashboard";

export default function DashboardSchedulingPaymentPage() {
  const paymentMethod = usePaymentStore((s) => s.paymentMethod);
  const setPaymentMethod = usePaymentStore((s) => s.setPaymentMethod);

  const isCardMethod = paymentMethod === "credit" || paymentMethod === "debit";

  return (
    <div className="mx-auto flex w-full max-w-312 flex-col gap-8 px-4 pt-13 pb-37.5 md:px-8 xl:px-0">
      <DsFlowHeader title="Realizar pagamento" />

      <section className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between xl:gap-30">
        <div className="flex min-h-133.25 w-full flex-col gap-8 rounded-2xl border border-nova-gray-300 px-6 py-8 md:px-10 md:py-12 xl:max-w-156.5">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.96px] text-black md:text-4xl">
              Selecione o metodo de pagamento
            </h2>
            <p className="text-base leading-[1.3] text-nova-gray-700">
              Escolha como deseja pagar pelo seu agendamento
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((pm) => (
              <DsPaymentMethodOption
                key={pm.method}
                icon={pm.icon}
                label={pm.label}
                description={pm.description}
                selected={paymentMethod === pm.method}
                onClick={() => setPaymentMethod(pm.method)}
              />
            ))}
          </div>

          {isCardMethod && <CardDetails />}

          <BillingInfo />

          <DsSecurePaymentBanner />
        </div>

        <DashboardOrderSummary />
      </section>
    </div>
  );
}
