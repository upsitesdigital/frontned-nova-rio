"use client";

import { usePathname } from "next/navigation";

import { DsLogo, DsStepper } from "@/design-system";

const SCHEDULING_STEPS = [
  { label: "Agendar serviço" },
  { label: "Dia e horário" },
  { label: "Cadastro" },
  { label: "Pagamento" },
];

const STEP_PATH_MAP: Record<string, number> = {
  servico: 0,
  "dia-horario": 1,
  cadastro: 2,
  pagamento: 3,
};

interface AgendamentoLayoutProps {
  children: React.ReactNode;
}

export default function AgendamentoLayout({ children }: AgendamentoLayoutProps) {
  const pathname = usePathname();
  const segment = pathname.split("/").pop() ?? "servico";
  const currentStep = STEP_PATH_MAP[segment] ?? 0;

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
      <main className="mx-auto w-full max-w-[1008px] px-(--page-padding) pb-8 pt-16">
        {children}
      </main>
    </div>
  );
}
