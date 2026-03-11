import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

type DsStatusPillVariant = "pending" | "cancelled" | "approved" | "active" | "inactive";

const variantStyles: Record<DsStatusPillVariant, string> = {
  pending: "bg-nova-warning/10 text-nova-warning",
  cancelled: "bg-nova-error/10 text-nova-error",
  approved: "bg-nova-success/10 text-nova-success",
  active: "bg-nova-success/10 text-nova-success",
  inactive: "bg-nova-error/10 text-nova-error",
};

interface DsStatusPillProps {
  icon: DsIconComponent;
  label: string;
  variant: DsStatusPillVariant;
  className?: string;
}

function DsStatusPill({ icon, label, variant, className }: DsStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-base leading-normal tracking-[-0.64px]",
        variantStyles[variant],
        className,
      )}
    >
      <DsIcon icon={icon} size="xs" />
      {label}
    </span>
  );
}

export { DsStatusPill, type DsStatusPillProps, type DsStatusPillVariant };
