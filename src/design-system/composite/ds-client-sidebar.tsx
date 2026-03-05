"use client";

import { useState } from "react";
import {
  HouseIcon,
  CalendarDotsIcon,
  CurrencyDollarSimpleIcon,
  UserIcon,
  SignOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsSidebar } from "@/design-system/navigation";
import { DsSidebarItem } from "@/design-system/navigation";
import { DsLogo } from "@/design-system/navigation";
import { DsIconButton } from "@/design-system/primitives";

interface DsClientSidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
  className?: string;
}

const clientNavItems = [
  { path: "/dashboard", label: "Minha Área", icon: HouseIcon },
  { path: "/dashboard/agendamentos", label: "Agendamentos", icon: CalendarDotsIcon },
  { path: "/dashboard/pagamentos", label: "Pagamentos", icon: CurrencyDollarSimpleIcon },
  { path: "/dashboard/perfil", label: "Meu Perfil", icon: UserIcon },
];

function DsClientSidebar({
  activePath,
  onNavigate,
  onSignOut,
  className,
}: DsClientSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <DsSidebar collapsed={collapsed} className={cn("h-full", className)}>
      <div className="flex flex-col gap-14">
        <div className="flex flex-col border-b border-nova-gray-300 pb-6">
          <div className="relative flex h-[80px] items-center">
            {!collapsed && <DsLogo />}
            <DsIconButton
              icon={collapsed ? CaretRightIcon : CaretLeftIcon}
              ariaLabel={collapsed ? "Expandir menu" : "Recolher menu"}
              variant="outline"
              size="icon-sm"
              className={cn(
                "size-9 rounded-[10px]",
                collapsed ? "mx-auto" : "absolute right-0 top-[22px]",
              )}
              onClick={() => setCollapsed((c) => !c)}
            />
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {clientNavItems.map((item) => (
            <DsSidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={activePath === item.path}
              collapsed={collapsed}
              href={item.path}
              onClick={
                onNavigate
                  ? () => onNavigate(item.path)
                  : undefined
              }
            />
          ))}
        </nav>
      </div>
      <DsSidebarItem
        icon={SignOutIcon}
        label="Sair"
        collapsed={collapsed}
        onClick={onSignOut}
      />
    </DsSidebar>
  );
}

export { DsClientSidebar, type DsClientSidebarProps };
