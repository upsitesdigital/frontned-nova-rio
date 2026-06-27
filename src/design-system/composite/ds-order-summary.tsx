"use client";

import { DsButton, DsSeparator } from "@/design-system";

interface DsOrderSummaryRow {
  label: string;
  value: string;
  emphasis?: "default" | "success";
}

interface DsOrderSummaryProps {
  title: string;
  serviceLabel: string;
  serviceName: string;
  rows: DsOrderSummaryRow[];
  totalLabel: string;
  totalValue: string;
  payLabel: string;
  termsText: string;
  payDisabled: boolean;
  errorText?: string | null;
  onPay: () => void;
}

function DsOrderSummary({
  title,
  serviceLabel,
  serviceName,
  rows,
  totalLabel,
  totalValue,
  payLabel,
  termsText,
  payDisabled,
  errorText,
  onPay,
}: DsOrderSummaryProps) {
  return (
    <div className="w-full shrink-0 rounded-2xl border border-nova-gray-300 px-6 py-10 sm:px-10 sm:py-12 lg:w-125.5">
      <div className="flex flex-col gap-8">
        <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">{title}</h3>

        <div className="flex flex-col gap-6 text-base leading-[1.3]">
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">{serviceLabel}</span>
            <span className="font-medium text-black">{serviceName}</span>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-nova-gray-700">{row.label}</span>
              <span
                className={
                  row.emphasis === "success"
                    ? "font-medium text-nova-success"
                    : "font-medium text-black"
                }
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <DsSeparator />

        <div className="flex items-center justify-between text-xl font-medium leading-[1.3] tracking-[-0.8px] text-black">
          <span>{totalLabel}</span>
          <span>{totalValue}</span>
        </div>

        <div className="flex flex-col gap-4">
          <DsButton size="flow" className="w-full" disabled={payDisabled} onClick={onPay}>
            {payLabel}
          </DsButton>
          {errorText && (
            <p className="text-center text-sm leading-[1.3] text-nova-error">{errorText}</p>
          )}
          <p className="text-center text-sm leading-[1.3] text-nova-gray-700">{termsText}</p>
        </div>
      </div>
    </div>
  );
}

export { DsOrderSummary, type DsOrderSummaryProps, type DsOrderSummaryRow };
