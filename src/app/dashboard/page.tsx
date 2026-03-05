"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  CalendarDotsIcon,
  ClockIcon,
  CurrencyDollarSimpleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import {
  DsClientSidebar,
  DsSidebarLayout,
  DsTopbar,
  DsPageContainer,
  DsStatCard,
  DsNotificationBell,
  DsAvatar,
} from "@/design-system";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    useAuthStore.getState().reset();
    router.push("/login");
  };

  return (
    <DsSidebarLayout
      sidebar={
        <DsClientSidebar
          activePath={pathname}
          onNavigate={(path) => router.push(path)}
          onSignOut={handleSignOut}
        />
      }
    >
      <div className="flex flex-col">
        <DsTopbar>
          <h2 className="text-lg font-medium text-black">Minha Área</h2>
          <div className="flex items-center gap-4">
            <DsNotificationBell count={0} />
            <DsAvatar fallback="U" size="sm" />
          </div>
        </DsTopbar>

        <DsPageContainer className="py-8">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
                Bem-vindo de volta!
              </h1>
              <p className="mt-1 text-base leading-normal text-nova-gray-700">
                Confira o resumo da sua conta.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <DsStatCard title="Agendamentos" value="0" icon={CalendarDotsIcon} />
              <DsStatCard title="Próximo serviço" value="---" icon={ClockIcon} />
              <DsStatCard title="Total gasto" value="R$ 0,00" icon={CurrencyDollarSimpleIcon} />
              <DsStatCard title="Concluídos" value="0" icon={CheckCircleIcon} />
            </div>
          </div>
        </DsPageContainer>
      </div>
    </DsSidebarLayout>
  );
}
