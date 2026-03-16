import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

type DsPaymentInfoCardStatus = "approved" | "pending" | "cancelled";

interface DsPaymentInfoCardProps {
  icon: DsIconComponent;
  description: string;
  amount: string;
  status: DsPaymentInfoCardStatus;
  statusLabel: string;
  className?: string;
}

const statusColors: Record<DsPaymentInfoCardStatus, string> = {
  approved: "text-primary",
  pending: "text-nova-warning",
  cancelled: "text-nova-error",
};

function DsPaymentInfoCard({
  icon,
  description,
  amount,
  status,
  statusLabel,
  className,
}: DsPaymentInfoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between overflow-clip rounded-2.5 border border-nova-gray-100 p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <DsIcon icon={icon} size="lg" className="shrink-0 text-nova-gray-700" />
        <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
          {description}
        </p>
      </div>
      <div className="flex flex-col items-end leading-[1.3]">
        <p className="text-base font-medium text-nova-gray-700">{amount}</p>
        <p className={cn("text-xs tracking-[-0.48px]", statusColors[status])}>{statusLabel}</p>
      </div>
    </div>
  );
}

export { DsPaymentInfoCard, type DsPaymentInfoCardProps, type DsPaymentInfoCardStatus };
