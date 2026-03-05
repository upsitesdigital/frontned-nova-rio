import { cn } from "@/lib/utils";
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
        "flex h-14 w-full cursor-pointer items-center gap-3 overflow-clip rounded-[10px] border p-4 transition-colors",
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
      <span className="whitespace-nowrap text-base font-medium leading-[1.3] text-black">
        {label}
      </span>
      <span className="whitespace-nowrap text-base leading-[1.3] text-nova-gray-700">
        {description}
      </span>
    </button>
  );
}

export { DsPaymentMethodOption, type DsPaymentMethodOptionProps };
