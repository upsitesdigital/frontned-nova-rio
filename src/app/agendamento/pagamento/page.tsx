"use client";

import { useCallback, useMemo } from "react";
import { Question } from "@phosphor-icons/react/dist/ssr";

import {
  DsButton,
  DsFlowHeader,
  DsFormField,
  DsIcon,
  DsInput,
  DsPaymentMethodOption,
  DsSecurePaymentBanner,
  DsSeparator,
} from "@/design-system";
import { PAYMENT_METHODS, SERVICE_FEE } from "@/config/payment";
import { FLOW_INPUT_CLASS } from "@/lib/constants";
import { formatCardNumber, formatCpfCnpj, formatCurrency, formatExpiry } from "@/lib/formatters";
import { usePaymentStore } from "@/stores/payment-store";
import { useServicesStore } from "@/stores/services-store";

export default function PagamentoPage() {
  const paymentMethod = usePaymentStore((s) => s.paymentMethod);
  const cardNumber = usePaymentStore((s) => s.cardNumber);
  const cardExpiry = usePaymentStore((s) => s.cardExpiry);
  const cardCvv = usePaymentStore((s) => s.cardCvv);
  const cardName = usePaymentStore((s) => s.cardName);
  const billingName = usePaymentStore((s) => s.billingName);
  const billingDocument = usePaymentStore((s) => s.billingDocument);
  const billingAddress = usePaymentStore((s) => s.billingAddress);
  const billingComplement = usePaymentStore((s) => s.billingComplement);

  const setPaymentMethod = usePaymentStore((s) => s.setPaymentMethod);
  const setCardNumber = usePaymentStore((s) => s.setCardNumber);
  const setCardExpiry = usePaymentStore((s) => s.setCardExpiry);
  const setCardCvv = usePaymentStore((s) => s.setCardCvv);
  const setCardName = usePaymentStore((s) => s.setCardName);
  const setBillingName = usePaymentStore((s) => s.setBillingName);
  const setBillingDocument = usePaymentStore((s) => s.setBillingDocument);
  const setBillingAddress = usePaymentStore((s) => s.setBillingAddress);
  const setBillingComplement = usePaymentStore((s) => s.setBillingComplement);

  const services = useServicesStore((s) => s.services);
  const selectedServiceId = useServicesStore((s) => s.selectedServiceId);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

  const subtotal = selectedService?.basePrice ?? 0;
  const total = subtotal + SERVICE_FEE;

  const isCardMethod = paymentMethod === "credit" || paymentMethod === "debit";

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(formatCardNumber(e.target.value)),
    [setCardNumber],
  );

  const handleExpiryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setCardExpiry(formatExpiry(e.target.value)),
    [setCardExpiry],
  );

  const handleCvvChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4)),
    [setCardCvv],
  );

  const handleDocumentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setBillingDocument(formatCpfCnpj(e.target.value)),
    [setBillingDocument],
  );

  return (
    <div className="flex flex-col items-center gap-12">
      <DsFlowHeader title="Realizar pagamento" />

      <div className="flex w-full items-start gap-4">
        {/* Left column */}
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {/* Payment Method Section */}
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

          {/* Card Details Section */}
          {isCardMethod && (
            <div className="flex flex-col gap-8 rounded-2xl border border-nova-gray-300 px-10 py-12">
              <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
                Dados do Cartão
              </h3>
              <div className="flex flex-col gap-5">
                <DsFormField label="Número do cartão">
                  <DsInput
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={FLOW_INPUT_CLASS}
                  />
                </DsFormField>
                <div className="flex gap-5">
                  <DsFormField label="Validade" className="flex-1">
                    <DsInput
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className={FLOW_INPUT_CLASS}
                    />
                  </DsFormField>
                  <DsFormField label="CVV" className="flex-1">
                    <div className="relative">
                      <DsInput
                        placeholder="123"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        className={`${FLOW_INPUT_CLASS} pr-10`}
                      />
                      <DsIcon
                        icon={Question}
                        size="md"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-nova-gray-500"
                      />
                    </div>
                  </DsFormField>
                </div>
                <DsFormField label="Nome no cartão">
                  <DsInput
                    placeholder="Nome como está no cartão"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={FLOW_INPUT_CLASS}
                  />
                </DsFormField>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="flex flex-col gap-8 rounded-2xl border border-nova-gray-300 px-10 py-12">
            <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
              Informações pessoais
            </h3>
            <div className="flex flex-col gap-5">
              <DsFormField label="Nome/ Razão Social">
                <DsInput
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className={FLOW_INPUT_CLASS}
                />
              </DsFormField>
              <DsFormField label="CPF/ CNPJ">
                <DsInput
                  value={billingDocument}
                  onChange={handleDocumentChange}
                  className={FLOW_INPUT_CLASS}
                />
              </DsFormField>
              <DsFormField label="Endereço de cobrança">
                <DsInput
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className={FLOW_INPUT_CLASS}
                />
              </DsFormField>
              <DsFormField label="Complemento (opcional)">
                <DsInput
                  value={billingComplement}
                  onChange={(e) => setBillingComplement(e.target.value)}
                  className={FLOW_INPUT_CLASS}
                />
              </DsFormField>
            </div>
          </div>

          {/* Secure Payment Banner */}
          <DsSecurePaymentBanner />
        </div>

        {/* Right column - Order Summary */}
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
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>

            <div className="flex flex-col gap-4">
              <DsButton size="flow" className="w-full">
                Pagar R$ {total.toFixed(2).replace(".", ",")}
              </DsButton>
              <p className="text-center text-sm leading-[1.3] text-nova-gray-700">
                Ao confirmar o pagamento, você concorda com nossos termos de serviço
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
