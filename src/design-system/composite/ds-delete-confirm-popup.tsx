"use client";

import { Trash, X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsDeleteConfirmPopupProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmIcon?: DsIconComponent;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
}

function DsDeleteConfirmPopup({
  title,
  description,
  confirmLabel = "Sim, quero excluir",
  confirmIcon = Trash,
  cancelLabel = "Manter o usuário",
  onConfirm,
  onCancel,
  onClose,
  className,
}: DsDeleteConfirmPopupProps) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-lg flex-col items-center gap-12 rounded-2xl bg-white px-8 py-12",
        className,
      )}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
        >
          <DsIcon icon={X} size="lg" />
        </button>
      )}

      <div className="flex w-full max-w-md flex-col items-center gap-2 text-center">
        <p className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
          {title}
        </p>
        {description && (
          <p className="text-base leading-normal text-nova-primary-dark">
            {description}
          </p>
        )}
      </div>

      <div className="flex w-full gap-8">
        {onConfirm && (
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-14 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-nova-error px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-nova-error transition-colors hover:bg-red-50"
          >
            {confirmIcon && <DsIcon icon={confirmIcon} size="lg" />}
            {confirmLabel}
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-14 flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-nova-gray-100 px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-nova-gray-700 transition-colors hover:bg-nova-gray-200"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export { DsDeleteConfirmPopup, type DsDeleteConfirmPopupProps };
