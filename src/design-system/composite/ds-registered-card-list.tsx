import { Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsRegisteredCardListProps {
  title?: string;
  addLabel?: string;
  onAdd?: () => void;
  children: React.ReactNode;
  className?: string;
}

function DsRegisteredCardList({
  title = "Cartões cadastrados",
  addLabel = "Adicionar",
  onAdd,
  children,
  className,
}: DsRegisteredCardListProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-clip rounded-[20px] border border-nova-gray-100 bg-white px-6 py-8",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-medium leading-[1.3] text-black">
          {title}
        </p>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 text-base font-medium leading-[1.3] text-nova-gray-700 transition-colors hover:text-nova-gray-900"
          >
            <DsIcon icon={Plus} size="md" />
            {addLabel}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-[10px]">{children}</div>
    </div>
  );
}

export { DsRegisteredCardList, type DsRegisteredCardListProps };
