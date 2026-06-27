"use client";

import { useCallback } from "react";
import { QuestionIcon } from "@phosphor-icons/react/dist/ssr";

import { DsFormField, DsIcon, DsInput } from "@/design-system";
import { Constants } from "@/lib/core/constants";
import { Formatters } from "@/lib/formatting/formatters";
import { usePaymentStore } from "@/stores/scheduling/payment-store";

export function CardDetails() {
  const cardNumber = usePaymentStore((s) => s.cardNumber);
  const cardExpiry = usePaymentStore((s) => s.cardExpiry);
  const cardCvv = usePaymentStore((s) => s.cardCvv);
  const cardName = usePaymentStore((s) => s.cardName);
  const errors = usePaymentStore((s) => s.errors);

  const setCardNumber = usePaymentStore((s) => s.setCardNumber);
  const setCardExpiry = usePaymentStore((s) => s.setCardExpiry);
  const setCardCvv = usePaymentStore((s) => s.setCardCvv);
  const setCardName = usePaymentStore((s) => s.setCardName);

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCardNumber(Formatters.formatCardNumber(e.target.value)),
    [setCardNumber],
  );

  const handleExpiryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCardExpiry(Formatters.formatExpiry(e.target.value)),
    [setCardExpiry],
  );

  const handleCvvChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4)),
    [setCardCvv],
  );

  return (
    <div className="flex flex-col gap-8 rounded-2xl border border-nova-gray-300 px-10 py-12">
      <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
        Dados do Cartão
      </h3>
      <div className="flex flex-col gap-5">
        <DsFormField label="Número do cartão" error={errors.cardNumber}>
          <DsInput
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            aria-invalid={!!errors.cardNumber}
            className={Constants.flowInputClass}
          />
        </DsFormField>
        <div className="flex gap-5">
          <DsFormField label="Validade" className="flex-1" error={errors.cardExpiry}>
            <DsInput
              placeholder="MM/AA"
              value={cardExpiry}
              onChange={handleExpiryChange}
              aria-invalid={!!errors.cardExpiry}
              className={Constants.flowInputClass}
            />
          </DsFormField>
          <DsFormField label="CVV" className="flex-1" error={errors.cardCvv}>
            <div className="relative">
              <DsInput
                placeholder="123"
                value={cardCvv}
                onChange={handleCvvChange}
                aria-invalid={!!errors.cardCvv}
                className={`${Constants.flowInputClass} pr-10`}
              />
              <DsIcon
                icon={QuestionIcon}
                size="md"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-nova-gray-500"
              />
            </div>
          </DsFormField>
        </div>
        <DsFormField label="Nome no cartão" error={errors.cardName}>
          <DsInput
            placeholder="Nome como está no cartão"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            aria-invalid={!!errors.cardName}
            className={Constants.flowInputClass}
          />
        </DsFormField>
      </div>
    </div>
  );
}
