"use client";

import { usePathname } from "next/navigation";

import { DsLogo, DsStepper } from "@/design-system";
import { SCHEDULING_STEPS, STEP_PATH_MAP } from "@/config/scheduling";

interface AgendamentoLayoutProps {
  children: React.ReactNode;
}

export default function AgendamentoLayout({ children }: AgendamentoLayoutProps) {
  const pathname = usePathname();
  const segment = pathname.split("/").pop() ?? "servico";
  const isConfirmation = segment === "confirmacao";
  const currentStep = STEP_PATH_MAP[segment] ?? 0;

  if (isConfirmation) {
    return (
      <div className="relative min-h-screen bg-nova-gray-50">
        <DsLogo className="fixed left-[80px] top-[60px] h-[84px]! w-[156px]!" />
        <main className="flex min-h-screen items-center justify-center px-(--page-padding)">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <DsLogo className="fixed left-[80px] top-[60px] h-[84px]! w-[156px]!" />

      <header className="flex justify-center px-(--page-padding) pb-8 pt-[94px]">
        <DsStepper
          steps={SCHEDULING_STEPS}
          currentStep={currentStep}
          className="w-full max-w-[1008px]"
        />
      </header>
      <main className="mx-auto w-full max-w-[1216px] px-(--page-padding) pb-8 pt-16">
        {children}
      </main>
    </div>
  );
}
