"use client";

import { DsOrderSummary } from "@/design-system";
import { useOrderSummary } from "@/lib/scheduling/use-order-summary";

export function DashboardOrderSummary() {
  const props = useOrderSummary("/dashboard/agendamento/confirmacao");

  return <DsOrderSummary {...props} />;
}
