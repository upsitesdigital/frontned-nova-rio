import { cn } from "@/lib/core/utils";

interface DsToggleButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function DsToggleButton({ label, active = false, onClick, className }: DsToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-[10px] px-3 py-2 text-sm font-medium leading-[1.3] text-nova-gray-700 transition-colors sm:px-4 sm:py-2.5 sm:text-base",
        active
          ? "bg-nova-gray-100"
          : "border border-nova-gray-200 bg-transparent hover:bg-nova-gray-50",
        className,
      )}
    >
      {label}
    </button>
  );
}

export { DsToggleButton, type DsToggleButtonProps };
