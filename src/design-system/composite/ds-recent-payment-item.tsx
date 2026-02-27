import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

type DsRecentPaymentStatus = "approved" | "pending";

interface DsRecentPaymentItemProps {
  icon: DsIconComponent;
  method: string;
  service: string;
  amount: string;
  status: DsRecentPaymentStatus;
  statusLabel: string;
  className?: string;
}

const statusColors: Record<DsRecentPaymentStatus, string> = {
  approved: "text-primary",
  pending: "text-[#e39725]",
};

function DsRecentPaymentItem({
  icon,
  method,
  service,
  amount,
  status,
  statusLabel,
  className,
}: DsRecentPaymentItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between overflow-clip rounded-[10px]",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <DsIcon icon={icon} size="lg" className="shrink-0 text-nova-gray-700" />
        <div className="flex w-[143px] flex-col gap-1 leading-[1.3] text-nova-gray-700">
          <p className="text-base font-medium tracking-[-0.64px]">{method}</p>
          <p className="text-xs tracking-[-0.48px]">{service}</p>
        </div>
      </div>
      <div className="flex flex-col items-end leading-[1.3] text-center">
        <p className="text-base font-medium text-nova-gray-700">{amount}</p>
        <p className={cn("text-xs tracking-[-0.48px]", statusColors[status])}>
          {statusLabel}
        </p>
      </div>
    </div>
  );
}

export {
  DsRecentPaymentItem,
  type DsRecentPaymentItemProps,
  type DsRecentPaymentStatus,
};
