import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsServiceManageCardProps {
  icon: DsIconComponent;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
  price?: string;
  onEdit?: () => void;
  editLabel?: string;
  onDelete?: () => void;
  deleteLabel?: string;
  className?: string;
}

function DsServiceManageCard({
  icon,
  iconColor = "text-nova-success",
  iconBgColor = "bg-nova-success/10",
  title,
  description,
  price,
  onEdit,
  editLabel = "Editar",
  onDelete,
  deleteLabel = "Excluir",
  className,
}: DsServiceManageCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-10",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        <div
          className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-full",
            iconBgColor,
          )}
        >
          <DsIcon icon={icon} size="xl" className={iconColor} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[20px] font-medium leading-[1.3] text-black">
            {title}
          </p>
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-primary-dark">
            {description}
          </p>
          {price && (
            <p className="text-sm font-medium leading-normal text-nova-gray-400">
              {price}
            </p>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex flex-1 gap-6">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex h-14 flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-nova-gray-100 px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-nova-gray-700 transition-colors hover:bg-nova-gray-200"
            >
              {editLabel}
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex h-14 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-nova-error px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-nova-error transition-colors hover:bg-red-50"
            >
              <DsIcon icon={TrashIcon} size="lg" />
              {deleteLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { DsServiceManageCard, type DsServiceManageCardProps };
