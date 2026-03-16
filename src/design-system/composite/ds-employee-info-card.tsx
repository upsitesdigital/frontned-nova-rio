"use client";

import { UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
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
        "flex items-start justify-between rounded-[6px] border border-nova-gray-100 bg-white p-8",
        className,
      )}
    >
      <div className="flex gap-20">
        <div className="flex w-75 shrink-0 gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-nova-info/10">
            <DsIcon icon={IconComponent} size="lg" className="text-nova-info" />
          </div>
          <div className="flex min-w-0 flex-col gap-6 py-2">
            <p className="truncate text-xl font-medium leading-[1.3] text-nova-gray-600">{name}</p>
            {contacts.length > 0 && (
              <div className="flex flex-col gap-2">
                {contacts.map((contact) => (
                  <div key={contact.value} className="flex items-center gap-2">
                    <DsIcon icon={contact.icon} size="lg" className="shrink-0 text-nova-info" />
                    <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                      {contact.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {(status || details.length > 0) && (
          <div className="flex w-77 flex-col gap-4 py-2">
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
                className="flex items-center gap-3 text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700"
              >
                <span className="shrink-0 font-medium">{detail.label}</span>
                <span className="flex-1">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-6">
          {actions.map((action) => (
            <DsButton
              key={action.label}
              variant="outline"
              size="flow-sm"
              onClick={action.onClick}
              className="border-nova-gray-200 px-6 text-nova-gray-700 hover:bg-nova-gray-50"
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
