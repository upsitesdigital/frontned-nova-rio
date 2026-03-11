import { cn } from "@/lib/utils";
import { DsImage } from "@/design-system/media";

interface DsRegisteredCardItemProps {
  brandSrc: string;
  lastDigits: string;
  expiry: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

function DsRegisteredCardItem({
  brandSrc,
  lastDigits,
  expiry,
  actionLabel = "Remover",
  onAction,
  className,
}: DsRegisteredCardItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between overflow-clip rounded-[10px] border border-nova-gray-300 py-4 pl-4 pr-8",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12.5 shrink-0 items-center justify-center rounded-[10px] bg-white">
          <DsImage src={brandSrc} alt="Card brand" width={50} height={50} />
        </div>
        <div className="flex w-35.75 flex-col gap-1 leading-[1.3]">
          <p className="text-base font-medium tracking-[-0.64px] text-black">
            Terminado em {lastDigits}
          </p>
          <p className="text-xs tracking-[-0.48px] text-nova-gray-700">Vencimento: {expiry}</p>
        </div>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="cursor-pointer text-base font-medium leading-[1.3] text-nova-gray-400 transition-colors hover:text-nova-gray-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export { DsRegisteredCardItem, type DsRegisteredCardItemProps };
