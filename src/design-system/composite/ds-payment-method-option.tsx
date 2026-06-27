import { cn } from "@/lib/core/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsPaymentMethodOptionProps {
  icon: DsIconComponent;
  label: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

function DsPaymentMethodOption({
  icon,
  label,
  description,
  selected = false,
  onClick,
  className,
}: DsPaymentMethodOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors",
        selected ? "border-primary bg-nova-primary-lighter" : "border-nova-gray-200 bg-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary" : "border-nova-gray-400",
        )}
      >
        {selected && <div className="size-2.5 rounded-full bg-primary" />}
      </div>
      <DsIcon icon={icon} size="md" className="shrink-0" />
      <div className="flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="text-base font-medium leading-[1.3] whitespace-nowrap text-black">
          {label}
        </span>
        <span className="text-sm leading-[1.3] text-nova-gray-700 sm:text-base">{description}</span>
      </div>
    </button>
  );
}

export { DsPaymentMethodOption, type DsPaymentMethodOptionProps };
