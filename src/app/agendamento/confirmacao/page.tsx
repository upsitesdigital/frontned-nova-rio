"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";

import { DsButton, DsIcon } from "@/design-system";
import { useConfirmationStore } from "@/stores/confirmation-store";

export default function ConfirmacaoPage() {
  const router = useRouter();
  const confirmation = useConfirmationStore((s) => s.confirmation);

  useEffect(() => {
    if (!confirmation) {
      router.replace("/agendamento/servico");
    }
  }, [confirmation, router]);

  if (!confirmation) return null;

  const formattedDate = format(new Date(confirmation.date), "dd/MM/yyyy");
  const formattedTime = `${confirmation.startTime}h`;

  return (
    <div className="flex w-[502px] flex-col items-center gap-14">
      <div className="flex flex-col items-center gap-4 text-center">
        <DsIcon icon={CheckIcon} size="lg" className="text-nova-primary" />
        <h1 className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
          Agendamento confirmado com sucesso!
        </h1>
        <p className="max-w-[388px] text-base leading-normal text-nova-gray-700">
          Obrigado por agendar a limpeza com a Nova Rio. A equipe de limpeza já foi notificada e
          começará o preparo para o atendimento.
        </p>
      </div>

      <div className="flex w-full flex-col gap-8 rounded-2xl border border-nova-gray-300 bg-white px-10 py-12">
        <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
          Resumo do pedido
        </h3>

        <div className="flex flex-col gap-6 text-base leading-[1.3]">
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">Serviço</span>
            <span className="font-medium text-black">{confirmation.serviceName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">Dia do serviço</span>
            <span className="font-medium text-black">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-nova-gray-700">Horário</span>
            <span className="font-medium text-black">{formattedTime}</span>
          </div>
        </div>

        <DsButton size="flow" onClick={() => router.push("/criar-conta")} className="w-full">
          Acessar minha área
        </DsButton>
      </div>
    </div>
  );
}
