import { cn } from "@/lib/utils";
import { DsImage } from "@/design-system/media";
import type { DsCreditCardBrand } from "@/design-system/data-display";

const brandImageMap: Record<DsCreditCardBrand, string> = {
  mastercard: "/icons/master-card-icon.svg",
  visa: "/icons/master-card-icon.svg",
  other: "/icons/master-card-icon.svg",
};

interface DsSavedCardItemProps {
  lastFour: string;
  expiration: string;
  brand: DsCreditCardBrand;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

function DsSavedCardItem({
  lastFour,
  expiration,
  brand,
  selected = false,
  onSelect,
  onRemove,
  removeLabel = "Remover",
  className,
}: DsSavedCardItemProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between overflow-clip rounded-[10px] border border-nova-gray-300 bg-white py-4 pl-4 pr-8",
        selected && "border-primary bg-nova-primary-lighter",
        onSelect && "cursor-pointer",
        className,
      )}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
    >
      <div className="flex items-center gap-4">
        {onSelect && (
          <div
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border",
              selected ? "border-primary" : "border-nova-gray-400",
            )}
          >
            {selected && <div className="size-2.5 rounded-full bg-primary" />}
          </div>
        )}
        <div className="flex size-12.5 shrink-0 items-center justify-center rounded-[10px] bg-white">
          <DsImage src={brandImageMap[brand]} alt={brand} width={36} height={24} />
        </div>
        <div className="flex w-36 flex-col items-start gap-1 leading-[1.3]">
          <span className="text-base font-medium tracking-[-0.64px] text-black">
            Terminado em {lastFour}
          </span>
          <span className="text-xs tracking-[-0.48px] text-nova-gray-700">
            Vencimento: {expiration}
          </span>
        </div>
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.stopPropagation();
            onRemove?.();
          }
        }}
        className="cursor-pointer text-base font-medium leading-[1.3] text-nova-gray-400 transition-colors hover:text-nova-gray-700"
      >
        {removeLabel}
      </span>
    </div>
  );
}

export { DsSavedCardItem, type DsSavedCardItemProps };
