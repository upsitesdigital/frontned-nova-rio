import { CheckIcon, HourglassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { DsStatusPill, type DsStatusPillVariant } from "./ds-status-pill";
import type { DsIconComponent } from "@/design-system/media";

type DsPaymentStatus = "APPROVED" | "PENDING" | "CANCELLED";

const statusConfig: Record<
  DsPaymentStatus,
  { icon: DsIconComponent; label: string; variant: DsStatusPillVariant }
> = {
  APPROVED: { icon: CheckIcon, label: "Aprovado", variant: "approved" },
  PENDING: { icon: HourglassIcon, label: "Pendente", variant: "pending" },
  CANCELLED: { icon: XIcon, label: "Cancelado", variant: "cancelled" },
};

interface DsPaymentStatusPillProps {
  status: DsPaymentStatus;
  className?: string;
}

function DsPaymentStatusPill({ status, className }: DsPaymentStatusPillProps) {
  const { icon, label, variant } = statusConfig[status];
  return <DsStatusPill icon={icon} label={label} variant={variant} className={className} />;
}

export { DsPaymentStatusPill, type DsPaymentStatusPillProps, type DsPaymentStatus };
