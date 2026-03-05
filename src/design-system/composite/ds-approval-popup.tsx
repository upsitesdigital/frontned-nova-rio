"use client";

import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsApprovalPopupDetail {
  label: string;
  value: string;
}

interface DsApprovalPopupStatus {
  icon: DsIconComponent;
  label: string;
  color: string;
  bgColor: string;
}

interface DsApprovalPopupProps {
  title: string;
  subtitle?: string;
  entityName: string;
  description?: string;
  status?: DsApprovalPopupStatus;
  details?: DsApprovalPopupDetail[];
  rejectLabel?: string;
  rejectIcon?: DsIconComponent;
  rejectDestructive?: boolean;
  approveLabel?: string;
  onReject?: () => void;
  onApprove?: () => void;
  onClose?: () => void;
  className?: string;
}

function DsApprovalPopup({
  title,
  subtitle,
  entityName,
  description,
  status,
  details = [],
  rejectLabel = "Reprovar cadastro",
  rejectIcon,
  rejectDestructive = false,
  approveLabel = "Aprovar cadastro",
  onReject,
  onApprove,
  onClose,
  className,
}: DsApprovalPopupProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-6 rounded-2xl bg-white px-8 py-10",
        className,
      )}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
        >
          <DsIcon icon={XIcon} size="lg" />
        </button>
      )}

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">{title}</p>
        {subtitle && <p className="text-base leading-normal text-nova-primary-dark">{subtitle}</p>}
      </div>

      <div className="flex w-full flex-col gap-8 rounded-2xl border border-nova-gray-200 p-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="flex-1 text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
              {entityName}
            </p>
            {status && (
              <span
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-base leading-normal tracking-[-0.64px]",
                  status.bgColor,
                  status.color,
                )}
              >
                <DsIcon icon={status.icon} size="sm" />
                {status.label}
              </span>
            )}
          </div>
          {description && (
            <p className="text-base leading-[1.3] text-nova-gray-700">{description}</p>
          )}
        </div>

        {details.length > 0 && (
          <div className="flex flex-col gap-4">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center justify-between overflow-clip text-base leading-[1.3]"
              >
                <span className="text-nova-gray-700">{detail.label}</span>
                <span className="font-medium text-black">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {(onReject || onApprove) && (
          <div className="flex gap-8">
            {onReject && (
              <button
                type="button"
                onClick={onReject}
                className={cn(
                  "flex h-[60px] flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] transition-colors",
                  rejectDestructive
                    ? "border-nova-error text-nova-error hover:bg-red-50"
                    : "border-nova-gray-400 text-nova-gray-700 hover:bg-nova-gray-50",
                )}
              >
                {rejectIcon && <DsIcon icon={rejectIcon} size="lg" />}
                {rejectLabel}
              </button>
            )}
            {onApprove && (
              <button
                type="button"
                onClick={onApprove}
                className="flex h-[60px] flex-1 cursor-pointer items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white transition-colors hover:bg-primary/90"
              >
                {approveLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export {
  DsApprovalPopup,
  type DsApprovalPopupProps,
  type DsApprovalPopupDetail,
  type DsApprovalPopupStatus,
};
