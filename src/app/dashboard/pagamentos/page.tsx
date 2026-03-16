"use client";

import { useEffect } from "react";
import { DsSkeleton } from "@/design-system";
import { usePaymentsPageStore } from "@/stores/payments-page-store";
import { PaymentsHistoryPanel } from "./_components/payments-history-panel";

export default function PagamentosPage() {
  const { isLoading, error, loadPayments } = usePaymentsPageStore();

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  if (isLoading) {
    return (
      <div>
        <DsSkeleton className="mb-16 h-16 w-64" />
        <DsSkeleton className="h-162.5 w-full rounded-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-base text-nova-error">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-16 text-[48px] font-semibold leading-[1.3] tracking-[-1.92px] text-black">
        Pagamentos
      </h1>
      <PaymentsHistoryPanel />
    </div>
  );
}
