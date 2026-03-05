import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsUserMenuItemProps {
  icon: DsIconComponent;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function DsUserMenuItem({
  icon,
  label,
  active = false,
  href,
  onClick,
  className,
}: DsUserMenuItemProps) {
  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      className={cn(
        "flex h-14 w-full items-center gap-2 rounded-[10px] px-6 py-4 text-base font-medium leading-[1.3] text-nova-gray-700 transition-colors",
        active ? "bg-nova-gray-50" : "hover:bg-nova-gray-100",
        className,
      )}
    >
      <DsIcon icon={icon} size="lg" className="shrink-0" />
      <span>{label}</span>
    </Component>
  );
}

export { DsUserMenuItem, type DsUserMenuItemProps };
