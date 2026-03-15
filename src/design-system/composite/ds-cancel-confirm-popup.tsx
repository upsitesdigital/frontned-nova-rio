"use client";

import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsCancelConfirmPopupProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
}

function DsCancelConfirmPopup({
  open,
  title = "Deseja cancelar o serviço?",
  description = "Cancelamento com 1h de antecedência",
  confirmLabel = "Sim, cancelar",
  cancelLabel = "Manter agendamento",
  onConfirm,
  onCancel,
  onClose,
  className,
}: DsCancelConfirmPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-nova-gray-900/20"
        onClick={onClose ?? onCancel}
        onKeyDown={(e) => {
          if (e.key === "Escape") (onClose ?? onCancel)?.();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Fechar"
      />

      <div
        className={cn(
          "relative flex w-full max-w-150 flex-col items-center gap-12 rounded-2xl bg-white px-8 py-12 shadow-lg shadow-nova-gray-300/10",
          className,
        )}
      >
        {(onClose ?? onCancel) && (
          <button
            type="button"
            onClick={onClose ?? onCancel}
            className="absolute right-6 top-6 cursor-pointer text-nova-gray-700 transition-colors hover:text-nova-gray-900"
          >
            <DsIcon icon={XIcon} size="lg" />
          </button>
        )}

        <div className="flex w-full max-w-md flex-col items-center gap-2 text-center">
          <p className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-nova-gray-900">
            {title}
          </p>
          {description && (
            <p className="text-base leading-normal text-nova-gray-700">{description}</p>
          )}
        </div>

        <div className="flex w-full gap-8">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-14 flex-1 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-nova-error px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-nova-error transition-colors hover:bg-red-50"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-14 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] bg-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white transition-colors hover:bg-primary/90"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export { DsCancelConfirmPopup, type DsCancelConfirmPopupProps };
