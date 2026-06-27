import { cn } from "@/lib/core/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsServiceOptionCardProps {
  icon: DsIconComponent;
  title: string;
  description: string;
  price: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

function DsServiceOptionCard({
  icon,
  title,
  description,
  price,
  selected = false,
  onClick,
  className,
}: DsServiceOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 cursor-pointer items-center gap-4 overflow-clip rounded-[10px] border px-4 py-4 text-left transition-colors sm:flex-col sm:gap-6 sm:px-4 sm:pb-12 sm:pt-8 sm:text-center",
        selected
          ? "border-primary bg-nova-primary-lighter"
          : "border-nova-gray-300 bg-white hover:border-nova-gray-400",
        className,
      )}
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-nova-primary-light sm:size-16">
        <DsIcon icon={icon} size="xl" className="text-primary" />
      </div>
      <div className="flex min-w-0 flex-col gap-1 sm:items-center sm:gap-2 sm:text-center">
        <span className="text-[18px] font-medium leading-[1.3] text-black sm:text-[20px]">
          {title}
        </span>
        <span className="text-sm leading-normal text-nova-gray-600 sm:text-base">
          {description}
        </span>
        <span className="text-sm font-medium leading-normal text-nova-gray-400">{price}</span>
      </div>
    </button>
  );
}

export { DsServiceOptionCard, type DsServiceOptionCardProps };
