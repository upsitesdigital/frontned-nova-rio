"use client";

import { usePathname } from "next/navigation";

import { DsLogo, DsStepper } from "@/design-system";
import { SchedulingConfig } from "@/config/scheduling";

interface AgendamentoLayoutProps {
  children: React.ReactNode;
}

export default function AgendamentoLayout({ children }: AgendamentoLayoutProps) {
  const pathname = usePathname();
  const segment = pathname.split("/").pop() ?? "servico";
  const isConfirmation = segment === "confirmacao";
  const currentStep = SchedulingConfig.stepPathMap[segment] ?? 0;

  if (isConfirmation) {
    return (
      <div className="relative min-h-screen bg-nova-gray-50">
        <DsLogo className="mx-auto mt-6 block h-14! w-auto! md:fixed md:left-20 md:top-15 md:mx-0 md:mt-0 md:h-21! md:w-39!" />
        <main className="flex min-h-screen items-center justify-center px-(--page-padding)">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <DsLogo className="mx-auto mt-6 block h-14! w-auto! md:fixed md:left-20 md:top-15 md:mx-0 md:mt-0 md:h-21! md:w-39!" />

      <header className="flex justify-center px-(--page-padding) pb-8 pt-8 md:pt-23.5">
        <DsStepper
          steps={SchedulingConfig.schedulingSteps}
          currentStep={currentStep}
          className="w-full max-w-252"
        />
      </header>
      <main className="mx-auto w-full max-w-304 px-(--page-padding) pb-8 pt-16">{children}</main>
    </div>
  );
}
