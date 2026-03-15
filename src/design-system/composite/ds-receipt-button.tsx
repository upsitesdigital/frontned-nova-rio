import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsReceiptButtonProps {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

function DsReceiptButton({
  label = "Baixar",
  disabled = false,
  onClick,
  className,
}: DsReceiptButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex w-27 items-center justify-center gap-2 rounded-full border border-nova-gray-300 p-1.5 text-base leading-normal tracking-[-0.64px] text-nova-gray-700 transition-colors",
        disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer hover:border-primary hover:text-primary",
        className,
      )}
    >
      {label}
      <DsIcon icon={DownloadSimpleIcon} size="md" className="text-nova-primary" />
    </button>
  );
}

export { DsReceiptButton, type DsReceiptButtonProps };
