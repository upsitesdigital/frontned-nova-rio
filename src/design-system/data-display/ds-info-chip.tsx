import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsInfoChipProps {
  icon: DsIconComponent;
  label: string;
  value: string;
  className?: string;
}

function DsInfoChip({ icon, label, value, className }: DsInfoChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-nova-gray-100 bg-white px-4 py-3",
        className,
      )}
    >
      <DsIcon icon={icon} size="lg" className="text-nova-gray-700" />
      <span className="whitespace-nowrap text-sm leading-normal text-nova-gray-700">
        {label}
      </span>
      <span className="whitespace-nowrap text-base leading-normal tracking-[-0.64px] text-black">
        {value}
      </span>
    </div>
  );
}

export { DsInfoChip, type DsInfoChipProps };
