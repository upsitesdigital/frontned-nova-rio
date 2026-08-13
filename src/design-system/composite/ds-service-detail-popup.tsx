import { ScrollIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

export interface DsServiceDetailPopupProps {
  icon: DsIconComponent;
  serviceName: string;
  date: string;
  onClose?: () => void;
  onReceipt?: () => void;
  receiptDisabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function DsServiceDetailPopup({
  icon,
  serviceName,
  date,
  onClose,
  onReceipt,
  receiptDisabled,
  children,
  className,
}: DsServiceDetailPopupProps) {
  return (
    <div
      className={cn(
        "relative max-h-[90vh] overflow-y-auto rounded-4xl border border-nova-gray-100 bg-white px-6 py-10 shadow-(--nova-shadow-medium) sm:px-15.25 sm:py-16",
        className,
      )}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer text-nova-gray-700 transition-colors hover:text-nova-gray-900"
        >
          <DsIcon icon={XIcon} size="lg" />
        </button>
      )}

      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-nova-primary-light">
              <DsIcon icon={icon} size="lg" className="text-primary" />
            </div>
            <p className="text-[24px] font-medium leading-[1.3] tracking-[-0.96px] text-black">
              {serviceName}
            </p>
          </div>
          {onReceipt && (
            <button
              type="button"
              onClick={onReceipt}
              disabled={receiptDisabled}
              className={cn(
                "flex items-center gap-1 rounded-[6px] border border-nova-gray-300 px-3 py-1.5 transition-colors",
                receiptDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-nova-gray-50",
              )}
            >
              <DsIcon icon={ScrollIcon} size="md" className="text-primary" />
              <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                Recibo
              </span>
            </button>
          )}
        </div>

        <p className="text-[32px] font-medium leading-none tracking-[-1.92px] sm:text-[48px] text-nova-primary-dark">
          {date}
        </p>

        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}
