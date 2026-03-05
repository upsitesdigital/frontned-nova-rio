import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsSidebarItemProps {
  icon: DsIconComponent;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function DsSidebarItem({
  icon,
  label,
  active = false,
  collapsed = false,
  href,
  onClick,
  className,
}: DsSidebarItemProps) {
  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      title={collapsed ? label : undefined}
      className={cn(
        "flex h-14 w-full items-center rounded-[10px] text-base font-medium leading-[1.3] text-nova-gray-700 transition-all",
        active ? "bg-nova-primary-lighter" : "hover:bg-nova-gray-100",
        collapsed ? "justify-center px-0" : "gap-2 px-6 py-4",
        className,
      )}
    >
      <DsIcon icon={icon} size="md" className="shrink-0" />
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </Component>
  );
}

export { DsSidebarItem, type DsSidebarItemProps };
