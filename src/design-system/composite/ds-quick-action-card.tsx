import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsQuickActionCardProps {
  icon: DsIconComponent;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

function DsQuickActionCard({
  icon,
  iconColor = "text-nova-primary",
  iconBgColor = "bg-nova-primary-light",
  title,
  description,
  onClick,
  className,
}: DsQuickActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-4 overflow-clip rounded-[10px] border border-nova-gray-300 bg-white px-4 py-6 transition-colors hover:border-nova-gray-400",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          iconBgColor,
        )}
      >
        <DsIcon icon={icon} size="lg" className={iconColor} />
      </div>
      <div className="flex flex-col gap-2 text-center">
        <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-black">
          {title}
        </span>
        <span className="text-sm leading-normal text-nova-gray-400">{description}</span>
      </div>
    </button>
  );
}

export { DsQuickActionCard, type DsQuickActionCardProps };
