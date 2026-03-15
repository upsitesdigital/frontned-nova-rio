import { ScrollIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsHighlightCardProps {
  title: string;
  value: string;
  subtitle?: string;
  inlineLabel?: string;
  icon?: DsIconComponent;
  iconColor?: string;
  iconBgColor?: string;
  valueColor?: string;
  onReceipt?: () => void;
  receiptDisabled?: boolean;
  className?: string;
}

function DsHighlightCard({
  title,
  value,
  subtitle,
  inlineLabel,
  icon,
  iconColor,
  iconBgColor,
  valueColor,
  onReceipt,
  receiptDisabled,
  className,
}: DsHighlightCardProps) {
  const showReceipt = onReceipt !== undefined || receiptDisabled;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-medium leading-[1.3] text-black">{title}</p>
        {showReceipt && (
          <button
            type="button"
            onClick={onReceipt}
            disabled={receiptDisabled}
            className={cn(
              "flex items-center gap-1 rounded-[6px] border px-3 py-1.5 transition-colors",
              receiptDisabled
                ? "cursor-not-allowed border-nova-gray-300"
                : "cursor-pointer border-nova-gray-300 hover:bg-nova-gray-50",
            )}
          >
            <DsIcon
              icon={ScrollIcon}
              size="md"
              className={receiptDisabled ? "text-nova-gray-400" : "text-nova-gray-700"}
            />
            <span
              className={cn(
                "text-base leading-[1.3] tracking-[-0.64px]",
                receiptDisabled ? "text-nova-gray-400" : "text-nova-gray-700",
              )}
            >
              Recibo
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          {icon && (
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                iconBgColor,
              )}
            >
              <DsIcon icon={icon} size="lg" className={iconColor} />
            </div>
          )}
          <p
            className={cn(
              "text-[48px] font-medium leading-none tracking-[-1.92px]",
              valueColor ?? "text-primary",
            )}
          >
            {value}
          </p>
          {inlineLabel && (
            <p className="text-sm leading-[1.3] tracking-[-0.56px] text-nova-gray-400">
              {inlineLabel}
            </p>
          )}
        </div>
        {subtitle && (
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export { DsHighlightCard, type DsHighlightCardProps };
