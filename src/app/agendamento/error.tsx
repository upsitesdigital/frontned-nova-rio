"use client";

import { DsButton } from "@/design-system";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgendamentoError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 text-center">
      <h2 className="text-2xl font-medium text-black">Algo deu errado</h2>
      <p className="max-w-md text-base text-nova-gray-700">
        Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
      </p>
      <div className="flex gap-4">
        <DsButton variant="outline" onClick={reset}>
          Tentar novamente
        </DsButton>
        <DsButton onClick={() => (window.location.href = "/agendamento/servico")}>
          Voltar ao início
        </DsButton>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-4 max-w-lg overflow-auto rounded bg-nova-gray-50 p-4 text-left text-xs text-nova-gray-700">
          {error.message}
        </pre>
      )}
    </div>
  );
}
