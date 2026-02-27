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
        "relative flex flex-col gap-[49px] overflow-clip rounded-[20px] bg-white px-[61px] py-16",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[rgba(0,167,126,0.1)]">
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

        {/* Date */}
        <p className="text-[48px] font-medium leading-none tracking-[-1.92px] text-nova-primary-dark">
          {date}
        </p>

        {/* Detail rows */}
        <div className="flex flex-col gap-2">{children}</div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer text-black transition-colors hover:text-nova-gray-700"
        >
          <DsIcon icon={XIcon} size="lg" />
        </button>
      )}
    </div>
  );
}

export { DsServiceDetailPopup, type DsServiceDetailPopupProps };
