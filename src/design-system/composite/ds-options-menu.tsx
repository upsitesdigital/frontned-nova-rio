import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsOptionsMenuItem {
  icon: DsIconComponent;
  label: string;
  onClick?: () => void;
}

interface DsOptionsMenuProps {
  items: DsOptionsMenuItem[];
  className?: string;
}

function DsOptionsMenu({ items, className }: DsOptionsMenuProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-2 shadow-[0px_12px_44px_0px_rgba(111,124,142,0.05)]",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-[10px] px-6 py-3 text-base font-medium leading-[1.3] text-nova-gray-700 transition-colors hover:bg-nova-gray-50"
        >
          <DsIcon icon={item.icon} size="lg" className="shrink-0" />
          {item.label}
        </button>
      ))}
    </div>
  );
}

export { DsOptionsMenu, type DsOptionsMenuProps, type DsOptionsMenuItem };
