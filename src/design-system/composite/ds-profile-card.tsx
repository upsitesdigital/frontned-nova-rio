import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsProfileCardAction {
  icon: DsIconComponent;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
}

interface DsProfileCardProps {
  initials: string;
  name: string;
  email: string;
  actions: DsProfileCardAction[];
  className?: string;
}

function DsProfileCard({
  initials,
  name,
  email,
  actions,
  className,
}: DsProfileCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-[20px] border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-nova-gray-300 bg-primary">
          <span className="text-[24px] font-medium leading-[1.3] tracking-[-0.96px] text-white">
            {initials}
          </span>
        </div>
        <div className="flex flex-col text-black">
          <p className="text-[24px] font-medium leading-[1.3] tracking-[-0.96px]">
            {name}
          </p>
          <p className="text-base leading-normal">{email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-[6px] p-4 transition-colors",
              action.variant === "destructive"
                ? "text-nova-error hover:bg-red-50"
                : "bg-nova-gray-50 text-nova-gray-700 hover:bg-nova-gray-100",
            )}
          >
            <DsIcon icon={action.icon} size="lg" className="shrink-0" />
            <span className="flex-1 text-left text-[18px] font-medium leading-normal tracking-[-0.72px]">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export {
  DsProfileCard,
  type DsProfileCardProps,
  type DsProfileCardAction,
};
