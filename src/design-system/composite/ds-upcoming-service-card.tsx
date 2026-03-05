import { ScrollIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsUpcomingServiceCardAction {
  label: string;
  variant: "filled" | "outlined";
  onClick?: () => void;
}

interface DsUpcomingServiceCardProps {
  title?: string;
  date: string;
  subtitle: string;
  actions?: DsUpcomingServiceCardAction[];
  onReceipt?: () => void;
  className?: string;
}

function DsUpcomingServiceCard({
  title = "Próximo serviço",
  date,
  subtitle,
  actions,
  onReceipt,
  className,
}: DsUpcomingServiceCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-medium leading-[1.3] text-black">
          {title}
        </p>
        {onReceipt && (
          <button
            type="button"
            onClick={onReceipt}
            className="flex cursor-pointer items-center gap-1 rounded-[6px] border border-nova-gray-300 px-3 py-1.5 transition-colors hover:bg-nova-gray-50"
          >
            <DsIcon icon={ScrollIcon} size="md" className="text-nova-gray-700" />
            <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              Recibo
            </span>
          </button>
        )}
      </div>

      {/* Date & subtitle */}
      <div className="flex flex-col gap-2">
        <p className="text-[48px] font-medium leading-none tracking-[-1.92px] text-primary">
          {date}
        </p>
        <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-400">
          {subtitle}
        </p>
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-start gap-6">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={cn(
                "flex h-14 cursor-pointer items-center justify-center rounded-[10px] px-8 py-4 text-[18px] font-medium leading-normal tracking-[-0.72px] text-nova-gray-700 transition-colors",
                action.variant === "filled"
                  ? "bg-nova-gray-100 hover:bg-nova-gray-200"
                  : "border border-nova-gray-300 hover:bg-nova-gray-50",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { DsUpcomingServiceCard, type DsUpcomingServiceCardProps, type DsUpcomingServiceCardAction };
