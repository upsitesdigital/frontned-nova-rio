import { cn } from "@/lib/utils";
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
        "flex flex-1 cursor-pointer flex-col items-center gap-6 overflow-clip rounded-[10px] border px-4 pb-12 pt-8 transition-colors",
        selected
          ? "border-primary bg-nova-primary-lighter"
          : "border-nova-gray-300 bg-white hover:border-nova-gray-400",
        className,
      )}
    >
      <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-nova-primary-light">
        <DsIcon icon={icon} size="xl" className="text-primary" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[20px] font-medium leading-[1.3] text-black">{title}</span>
        <span className="text-base leading-normal text-nova-gray-600">{description}</span>
      </div>
      <span className="text-sm font-medium leading-normal text-nova-gray-400">{price}</span>
    </button>
  );
}

export { DsServiceOptionCard, type DsServiceOptionCardProps };
