"use client";

import { useCallback } from "react";

import { DsFormField, DsInput } from "@/design-system";
import { FLOW_INPUT_CLASS } from "@/lib/constants";
import { formatCpfCnpj } from "@/lib/formatters";
import { usePaymentStore } from "@/stores/payment-store";

function BillingInfo() {
  const billingName = usePaymentStore((s) => s.billingName);
  const billingDocument = usePaymentStore((s) => s.billingDocument);
  const billingAddress = usePaymentStore((s) => s.billingAddress);
  const billingComplement = usePaymentStore((s) => s.billingComplement);
  const errors = usePaymentStore((s) => s.errors);

  const setBillingName = usePaymentStore((s) => s.setBillingName);
  const setBillingDocument = usePaymentStore((s) => s.setBillingDocument);
  const setBillingAddress = usePaymentStore((s) => s.setBillingAddress);
  const setBillingComplement = usePaymentStore((s) => s.setBillingComplement);

  const handleDocumentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setBillingDocument(formatCpfCnpj(e.target.value)),
    [setBillingDocument],
  );

  return (
    <div className="flex flex-col gap-8 rounded-2xl border border-nova-gray-300 px-10 py-12">
      <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
        Informações pessoais
      </h3>
      <div className="flex flex-col gap-5">
        <DsFormField label="Nome/ Razão Social" error={errors.billingName}>
          <DsInput
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            aria-invalid={!!errors.billingName}
            className={FLOW_INPUT_CLASS}
          />
        </DsFormField>
        <DsFormField label="CPF/ CNPJ" error={errors.billingDocument}>
          <DsInput
            value={billingDocument}
            onChange={handleDocumentChange}
            aria-invalid={!!errors.billingDocument}
            className={FLOW_INPUT_CLASS}
          />
        </DsFormField>
        <DsFormField label="Endereço de cobrança" error={errors.billingAddress}>
          <DsInput
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            aria-invalid={!!errors.billingAddress}
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
  );
}

export { BillingInfo };
