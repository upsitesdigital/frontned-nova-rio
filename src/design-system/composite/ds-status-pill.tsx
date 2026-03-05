import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

type DsStatusPillVariant = "pending" | "cancelled" | "approved";

const variantStyles: Record<DsStatusPillVariant, string> = {
  pending: "bg-[rgba(227,151,37,0.1)] text-[#e39725]",
  cancelled: "bg-[rgba(219,65,70,0.1)] text-[#db4146]",
  approved: "bg-[rgba(0,167,126,0.1)] text-primary",
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
