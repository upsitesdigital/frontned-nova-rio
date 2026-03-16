"use client";

import { UsersThreeIcon, UsersIcon, BroomIcon, NoteIcon } from "@phosphor-icons/react/dist/ssr";
import { DsQuickActionCard } from "@/design-system";

interface AdminQuickActionsPanelProps {
  onNavigate?: (path: string) => void;
}

function AdminQuickActionsPanel({ onNavigate }: AdminQuickActionsPanelProps) {
  return (
    <div className="flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6">
      <p className="text-xl font-medium leading-[1.3] text-black">Ações rápidas</p>
      <div className="grid grid-cols-2 gap-4">
        <DsQuickActionCard
          icon={UsersThreeIcon}
          iconColor="text-nova-purple"
          iconBgColor="bg-nova-purple-light"
          title="Clientes"
          description="Gerenciar clientes"
          onClick={() => onNavigate?.("/admin/clientes")}
        />
        <DsQuickActionCard
          icon={UsersIcon}
          iconColor="text-nova-info"
          iconBgColor="bg-nova-info-light"
          title="Funcionários"
          description="Gerenciar equipe"
          onClick={() => onNavigate?.("/admin/funcionarios")}
        />
        <DsQuickActionCard
          icon={BroomIcon}
          iconColor="text-nova-primary"
          iconBgColor="bg-nova-primary-light"
          title="Agendamentos"
          description="Ver serviços"
          onClick={() => onNavigate?.("/admin/agendamentos")}
        />
        <DsQuickActionCard
          icon={NoteIcon}
          iconColor="text-nova-lime"
          iconBgColor="bg-nova-lime-light"
          title="Relatórios"
          description="Relatórios dos serviços"
          onClick={() => onNavigate?.("/admin/relatorios")}
        />
      </div>
    </div>
  );
}

export { AdminQuickActionsPanel, type AdminQuickActionsPanelProps };
