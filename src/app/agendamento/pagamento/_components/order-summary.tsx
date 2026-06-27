"use client";

import { DsOrderSummary } from "@/design-system";
import { useOrderSummary } from "@/lib/scheduling/use-order-summary";

export function OrderSummary() {
  const props = useOrderSummary("/agendamento/confirmacao");

  return <DsOrderSummary {...props} />;
}
