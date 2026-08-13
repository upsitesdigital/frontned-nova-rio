"use client";

import { UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { DsButton } from "@/design-system/primitives";
import { DsStatusPill, type DsStatusPillVariant } from "@/design-system/composite/ds-status-pill";

interface DsEmployeeInfoCardContact {
  icon: DsIconComponent;
  value: string;
}

interface DsEmployeeInfoCardDetail {
  label: string;
  value: string;
}

interface DsEmployeeInfoCardAction {
  label: string;
  icon?: DsIconComponent;
  onClick?: () => void;
}

interface DsEmployeeInfoCardStatus {
  icon: DsIconComponent;
  label: string;
  variant: DsStatusPillVariant;
}

interface DsEmployeeInfoCardProps {
  name: string;
  icon?: DsIconComponent;
  contacts?: DsEmployeeInfoCardContact[];
  status?: DsEmployeeInfoCardStatus;
  details?: DsEmployeeInfoCardDetail[];
  actions?: DsEmployeeInfoCardAction[];
  className?: string;
}

function DsEmployeeInfoCard({
  name,
  icon: IconComponent = UsersIcon,
  contacts = [],
  status,
  details = [],
  actions = [],
  className,
}: DsEmployeeInfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-[6px] border border-nova-gray-100 bg-white p-5 sm:p-8 xl:flex-row xl:items-start xl:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-20">
        <div className="flex w-full gap-4 lg:w-75 lg:shrink-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-nova-info/10">
            <DsIcon icon={IconComponent} size="lg" className="text-nova-info" />
          </div>
          <div className="flex min-w-0 flex-col gap-6 py-2">
            <p className="truncate text-lg font-medium leading-[1.3] text-nova-gray-600 sm:text-xl">
              {name}
            </p>
            {contacts.length > 0 && (
              <div className="-ml-14 flex flex-col gap-2 lg:ml-0">
                {contacts.map((contact) => (
                  <div key={contact.value} className="flex items-center gap-2">
                    <DsIcon icon={contact.icon} size="lg" className="shrink-0 text-nova-info" />
                    <span className="text-sm leading-[1.3] tracking-[-0.64px] text-nova-gray-700 sm:text-base">
                      {contact.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {(status || details.length > 0) && (
          <div className="flex w-full flex-col gap-4 py-2 lg:w-77">
            {status && (
              <DsStatusPill
                icon={status.icon}
                label={status.label}
                variant={status.variant}
                className="w-fit"
              />
            )}
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center gap-2 text-sm leading-[1.3] tracking-[-0.64px] text-nova-gray-700 sm:gap-3 sm:text-base"
              >
                <span className="shrink-0 font-medium">{detail.label}</span>
                <span className="flex-1 whitespace-nowrap">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex shrink-0 items-center gap-3 xl:gap-6">
          {actions.map((action) => (
            <DsButton
              key={action.label}
              variant="outline"
              size="flow-sm"
              onClick={action.onClick}
              className="min-w-0 flex-1 border-nova-gray-200 px-3 text-nova-gray-700 hover:bg-nova-gray-50 sm:px-6 xl:flex-none"
            >
              {action.icon && <DsIcon icon={action.icon} size="lg" className="text-nova-info" />}
              {action.label}
            </DsButton>
          ))}
        </div>
      )}
    </div>
  );
}

export {
  DsEmployeeInfoCard,
  type DsEmployeeInfoCardProps,
  type DsEmployeeInfoCardContact,
  type DsEmployeeInfoCardDetail,
  type DsEmployeeInfoCardAction,
  type DsEmployeeInfoCardStatus,
};
