import { DotsThreeVerticalIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsHighlightCardProps {
  title: string;
  value: string;
  subtitle: string;
  onOptionsClick?: () => void;
  className?: string;
}

function DsHighlightCard({
  title,
  value,
  subtitle,
  onOptionsClick,
  className,
}: DsHighlightCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      <p className="text-[20px] font-medium leading-[1.3] text-black">
        {title}
      </p>
      <div className="flex flex-col gap-2">
        <p className="text-[48px] font-medium leading-none tracking-[-1.92px] text-primary">
          {value}
        </p>
        <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-400">
          {subtitle}
        </p>
      </div>
      {onOptionsClick && (
        <button
          type="button"
          onClick={onOptionsClick}
          className="absolute right-[17px] top-[15px] flex size-8 cursor-pointer items-center justify-center rounded-[6px] border border-nova-gray-300 transition-colors hover:bg-nova-gray-50"
        >
          <DsIcon icon={DotsThreeVerticalIcon} size="lg" />
        </button>
      )}
    </div>
  );
}

export { DsHighlightCard, type DsHighlightCardProps };
