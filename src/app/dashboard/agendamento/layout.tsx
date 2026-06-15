"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DsStepper } from "@/design-system";
import { ProfileApi } from "@/api/client/profile-api";
import { useRegistrationStore } from "@/stores/auth/registration-store";

interface DashboardAgendamentoLayoutProps {
  children: React.ReactNode;
}

const dashboardSchedulingSteps = [
  { label: "Agendar serviço" },
  { label: "Dia e horário" },
  { label: "Pagamento" },
];

const dashboardStepPathMap: Record<string, number> = {
  servico: 0,
  "dia-horario": 1,
  pagamento: 2,
};

export default function DashboardAgendamentoLayout({ children }: DashboardAgendamentoLayoutProps) {
  const pathname = usePathname();
  const segment = pathname.split("/").pop() ?? "servico";
  const isConfirmation = segment === "confirmacao";
  const currentStep = dashboardStepPathMap[segment] ?? 0;

  useEffect(() => {
    let active = true;

    ProfileApi.fetchClientProfile()
      .then((profile) => {
        if (!active) return;
        const registration = useRegistrationStore.getState();
        registration.setName(profile.name ?? "");
        registration.setEmail(profile.email ?? "");
        registration.setPhone(profile.phone ?? "");
      })
      .catch(() => {
        // No-op: the flow still works if profile data is temporarily unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  if (isConfirmation) {
    return (
      <main className="flex min-h-[calc(100vh-180px)] items-center justify-center">{children}</main>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-8">
      <header className="mx-auto w-full max-w-252">
        <DsStepper steps={dashboardSchedulingSteps} currentStep={currentStep} />
      </header>

      <main className="mx-auto w-full max-w-304">{children}</main>
    </div>
  );
}
