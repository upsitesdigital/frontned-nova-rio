import { ScrollIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsServiceDetailPopupProps {
  icon: DsIconComponent;
  serviceName: string;
  date: string;
  onClose?: () => void;
  onReceipt?: () => void;
  children: React.ReactNode;
  className?: string;
}

function DsServiceDetailPopup({
  icon,
  serviceName,
  date,
  onClose,
  onReceipt,
  children,
  className,
}: DsServiceDetailPopupProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-8 bg-white px-[60px] pb-[60px] pt-[120px]",
        className,
      )}
    >
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute left-[60px] top-10 flex size-[44px] cursor-pointer items-center justify-center rounded-[6px] bg-nova-gray-50 transition-colors hover:bg-nova-gray-100"
        >
          <DsIcon icon={XIcon} size="lg" />
        </button>
      )}

      {/* Header section */}
      <div className="flex w-full flex-col gap-4">
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
              className="flex cursor-pointer items-center gap-1 rounded-[6px] border border-nova-gray-300 px-3 py-1.5 transition-colors hover:bg-nova-gray-50"
            >
              <DsIcon icon={ScrollIcon} size="md" className="text-nova-gray-700" />
              <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                Recibo
              </span>
            </button>
          )}
        </div>

        <p className="text-[48px] font-medium leading-none tracking-[-1.92px] text-nova-primary-dark">
          {date}
        </p>
      </div>

      {children}
    </div>
  );
}

export { DsServiceDetailPopup, type DsServiceDetailPopupProps };
