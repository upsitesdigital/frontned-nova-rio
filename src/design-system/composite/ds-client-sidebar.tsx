"use client";

import { useState } from "react";
import {
  HouseIcon,
  BroomIcon,
  CurrencyDollarSimpleIcon,
  SignOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsSidebar } from "@/design-system/navigation";
import { DsSidebarItem } from "@/design-system/navigation";
import { DsLogo } from "@/design-system/navigation";
import { DsIconButton } from "@/design-system/primitives";
import { DsIcon } from "@/design-system/media";

interface DsClientSidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
  onScheduleService?: () => void;
  onSignOut?: () => void;
  className?: string;
}

const clientNavItems = [
  { path: "/dashboard", label: "Minha Área", icon: HouseIcon },
  { path: "/dashboard/servicos", label: "Meus serviços", icon: BroomIcon },
  { path: "/dashboard/pagamentos", label: "Pagamentos", icon: CurrencyDollarSimpleIcon },
];

function DsClientSidebar({
  activePath,
  onNavigate,
  onScheduleService,
  onSignOut,
  className,
}: DsClientSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <DsSidebar collapsed={collapsed} className={cn("h-full", className)}>
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-12 border-b border-nova-gray-300 pb-6">
          <div className="relative flex h-20 items-center">
            {!collapsed && <DsLogo />}
            <DsIconButton
              icon={collapsed ? CaretRightIcon : CaretLeftIcon}
              iconSize="lg"
              iconWeight="bold"
              ariaLabel={collapsed ? "Expandir menu" : "Recolher menu"}
              variant="outline"
              size="icon-sm"
              className={cn(
                "size-9 rounded-[10px] border-nova-gray-300 text-nova-primary",
                collapsed ? "mx-auto" : "absolute right-0 top-5.5",
              )}
              onClick={() => setCollapsed((c) => !c)}
            />
          </div>
          <button
            type="button"
            onClick={onScheduleService}
            className={cn(
              "flex h-14 w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-nova-primary text-lg font-medium leading-normal tracking-[-0.72px] text-white transition-colors hover:bg-nova-primary-dark",
              collapsed && "px-0",
            )}
          >
            <DsIcon icon={PlusIcon} size="lg" className="shrink-0 text-white" />
            {!collapsed && <span>Agendar serviço</span>}
          </button>
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
              onClick={onNavigate ? () => onNavigate(item.path) : undefined}
            />
          ))}
        </nav>
      </div>
      <DsSidebarItem icon={SignOutIcon} label="Sair" collapsed={collapsed} onClick={onSignOut} />
    </DsSidebar>
  );
}

export { DsClientSidebar, type DsClientSidebarProps };
