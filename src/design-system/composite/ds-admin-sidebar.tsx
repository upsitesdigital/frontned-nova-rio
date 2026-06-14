"use client";

import { SignOutIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsSidebar, DsSidebarItem, DsLogo } from "@/design-system/navigation";
import { DsIconButton } from "@/design-system/primitives";
import type { DsIconComponent } from "@/design-system/media";

type DsAdminNavItem = {
  path: string;
  label: string;
  icon: DsIconComponent;
  disabled?: boolean;
};

interface DsAdminSidebarProps {
  items: DsAdminNavItem[];
  signOutLabel: string;
  expandLabel: string;
  collapseLabel: string;
  activePath?: string;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
  className?: string;
}

function DsAdminSidebar({
  items,
  signOutLabel,
  expandLabel,
  collapseLabel,
  activePath,
  collapsed,
  onCollapsedChange,
  onNavigate,
  onSignOut,
  className,
}: DsAdminSidebarProps) {
  const handleToggle = () => {
    onCollapsedChange(!collapsed);
  };

  return (
    <DsSidebar collapsed={collapsed} className={cn("h-full", className)}>
      <div className="flex flex-col gap-14">
        <div className="flex flex-col border-b border-nova-gray-300 pb-6">
          <div className="relative flex h-20 items-center">
            {!collapsed && <DsLogo />}
            <DsIconButton
              icon={collapsed ? CaretRightIcon : CaretLeftIcon}
              ariaLabel={collapsed ? expandLabel : collapseLabel}
              variant="outline"
              size="icon-sm"
              className={cn(
                "size-9 rounded-[10px] border-nova-gray-300 text-nova-primary",
                collapsed ? "mx-auto" : "absolute right-0 top-5.5",
              )}
              onClick={handleToggle}
            />
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <DsSidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={
                item.path === "/admin"
                  ? activePath === item.path
                  : (activePath?.startsWith(item.path) ?? false)
              }
              collapsed={collapsed}
              disabled={item.disabled}
              href={item.path}
              onClick={onNavigate && !item.disabled ? () => onNavigate(item.path) : undefined}
            />
          ))}
        </nav>
      </div>
      <DsSidebarItem
        icon={SignOutIcon}
        label={signOutLabel}
        collapsed={collapsed}
        onClick={onSignOut}
      />
    </DsSidebar>
  );
}

export { DsAdminSidebar, type DsAdminSidebarProps, type DsAdminNavItem };
