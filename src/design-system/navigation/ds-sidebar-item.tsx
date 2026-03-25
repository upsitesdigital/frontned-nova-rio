"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsSidebarItemProps {
  icon: DsIconComponent;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function DsSidebarItem({
  icon,
  label,
  active = false,
  collapsed = false,
  disabled = false,
  href,
  onClick,
  className,
}: DsSidebarItemProps) {
  const Component = href && !disabled ? "a" : "button";

  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (href && onClick) {
      e.preventDefault();
    }
    onClick?.();
  };

  return (
    <Component
      href={disabled ? undefined : href}
      onClick={handleClick}
      type={href && !disabled ? undefined : "button"}
      disabled={disabled}
      title={collapsed ? label : undefined}
      className={cn(
        "flex h-14 w-full items-center rounded-[10px] text-base font-medium leading-[1.3] transition-all focus-visible:ring-2 focus-visible:ring-nova-primary focus-visible:outline-none",
        disabled
          ? "cursor-not-allowed text-nova-gray-400"
          : active
            ? "bg-nova-primary-lighter text-black"
            : "text-nova-gray-700 hover:bg-nova-gray-100",
        collapsed ? "justify-center px-0" : "gap-2 px-6 py-4",
        className,
      )}
    >
      <DsIcon
        icon={icon}
        size="lg"
        className={cn("shrink-0", active && !disabled && "text-nova-primary")}
      />
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </Component>
  );
}

export { DsSidebarItem, type DsSidebarItemProps };
