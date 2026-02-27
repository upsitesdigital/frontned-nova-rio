import { cn } from "@/lib/utils";

interface DsRadioOptionCardProps {
  label: string;
  selected?: boolean;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

function DsRadioOptionCard({
  label,
  selected = false,
  badge,
  onClick,
  className,
}: DsRadioOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-14 shrink-0 cursor-pointer items-center gap-3 rounded-[10px] border p-4 transition-colors",
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
      <span className="whitespace-nowrap text-base font-medium leading-[1.3] text-black">
        {label}
      </span>
      {badge && (
        <span className="absolute -top-2.5 right-3 rounded-md bg-nova-warning-light px-1.5 py-0.5 text-xs font-medium leading-[1.3] text-black">
          {badge}
        </span>
      )}
    </button>
  );
}

export { DsRadioOptionCard, type DsRadioOptionCardProps };
