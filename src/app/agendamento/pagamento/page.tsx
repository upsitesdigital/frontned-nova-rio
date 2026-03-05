"use client";

import { DsFlowHeader, DsPaymentMethodOption, DsSecurePaymentBanner } from "@/design-system";
import { PAYMENT_METHODS } from "@/config/payment";
import { usePaymentStore } from "@/stores/payment-store";

import { BillingInfo } from "./_components/billing-info";
import { CardDetails } from "./_components/card-details";
import { OrderSummary } from "./_components/order-summary";

export default function PagamentoPage() {
  const paymentMethod = usePaymentStore((s) => s.paymentMethod);
  const setPaymentMethod = usePaymentStore((s) => s.setPaymentMethod);

  const isCardMethod = paymentMethod === "credit" || paymentMethod === "debit";

  return (
    <div className="flex flex-col items-center gap-12">
      <DsFlowHeader title="Realizar pagamento" />

      <div className="flex w-full items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex flex-col gap-8 rounded-2xl border border-nova-gray-300 px-10 py-12">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
                Método de pagamento
              </h3>
              <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                Escolha como deseja pagar pelo serviço
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
          </div>

          {isCardMethod && <CardDetails />}

          <BillingInfo />

          <DsSecurePaymentBanner />
        </div>

        <OrderSummary />
      </div>
    </div>
  );
}
