"use client";

import {
  HouseIcon,
  BroomIcon,
  UsersIcon,
  UsersThreeIcon,
  MapPinIcon,
  TimerIcon,
  CalendarBlankIcon,
  CurrencyDollarSimpleIcon,
  NoteIcon,
  SignOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsSidebar, DsSidebarItem, DsLogo } from "@/design-system/navigation";
import { DsIconButton } from "@/design-system/primitives";

interface DsAdminSidebarProps {
  activePath?: string;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
  className?: string;
}

const adminNavItems = [
  { path: "/admin", label: "Minha Área", icon: HouseIcon },
  { path: "/admin/agendamentos", label: "Agendamentos", icon: BroomIcon },
  { path: "/admin/funcionarios", label: "Funcionários", icon: UsersIcon },
  { path: "/admin/clientes", label: "Clientes", icon: UsersThreeIcon },
  {
    path: "/admin/pagamentos",
    label: "Pagamentos",
    icon: CurrencyDollarSimpleIcon,
  },
  { path: "/admin/relatorios", label: "Relatórios", icon: NoteIcon },
  { path: "/admin/servicos", label: "Serviços", icon: BroomIcon },
  { path: "/admin/unidades", label: "Unidades", icon: MapPinIcon },
  { path: "/admin/pacotes", label: "Pacotes", icon: TimerIcon },
  { path: "/admin/feriados", label: "Feriados", icon: CalendarBlankIcon },
  { path: "/admin/usuarios", label: "Usuários", icon: UsersThreeIcon },
];

function DsAdminSidebar({
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
              ariaLabel={collapsed ? "Expandir menu" : "Recolher menu"}
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
          {adminNavItems.map((item) => (
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
      <DsSidebarItem icon={SignOutIcon} label="Sair" collapsed={collapsed} onClick={onSignOut} />
    </DsSidebar>
  );
}

export { DsAdminSidebar, type DsAdminSidebarProps };
