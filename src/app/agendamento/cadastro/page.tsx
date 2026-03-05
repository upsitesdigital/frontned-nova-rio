"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  DsButton,
  DsFlowCard,
  DsFlowHeader,
  DsFormField,
  DsInput,
  DsPasswordInput,
  DsPopup,
} from "@/design-system";
import { useSchedulingStore } from "@/stores/scheduling-store";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function CadastroPage() {
  const router = useRouter();

  const registerName = useSchedulingStore((s) => s.registerName);
  const registerEmail = useSchedulingStore((s) => s.registerEmail);
  const registerPhone = useSchedulingStore((s) => s.registerPhone);
  const registerPassword = useSchedulingStore((s) => s.registerPassword);
  const isRegistering = useSchedulingStore((s) => s.isRegistering);
  const registerErrors = useSchedulingStore((s) => s.registerErrors);
  const registerSuccess = useSchedulingStore((s) => s.registerSuccess);

  const setRegisterName = useSchedulingStore((s) => s.setRegisterName);
  const setRegisterEmail = useSchedulingStore((s) => s.setRegisterEmail);
  const setRegisterPhone = useSchedulingStore((s) => s.setRegisterPhone);
  const setRegisterPassword = useSchedulingStore((s) => s.setRegisterPassword);
  const submitRegistration = useSchedulingStore((s) => s.submitRegistration);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterPhone(formatPhone(e.target.value));
    },
    [setRegisterPhone],
  );

  const canSubmit =
    registerName.trim().length > 0 &&
    registerEmail.trim().length > 0 &&
    registerPassword.trim().length >= 8 &&
    !isRegistering;

  const handleSubmit = useCallback(async () => {
    await submitRegistration();
  }, [submitRegistration]);

  return (
    <>
      <DsFlowCard>
        <DsFlowHeader
          title="Cadastrar e-mail"
          subtitle="Cadastre seu e-mail para prosseguir com o pagamento."
        />

        <div className="flex w-full flex-col gap-4">
          <DsFormField label="Nome" error={registerErrors.name}>
            <DsInput
              placeholder="Digite seu Nome"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              aria-invalid={!!registerErrors.name}
              className="rounded-[6px] border-nova-gray-500 px-4 py-3 text-base leading-normal tracking-[-0.64px] shadow-none data-[size=default]:h-auto"
            />
          </DsFormField>

          <DsFormField label="E-mail" error={registerErrors.email}>
            <DsInput
              type="email"
              placeholder="Digite seu e-mail"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              aria-invalid={!!registerErrors.email}
              className="rounded-[6px] border-nova-gray-500 px-4 py-3 text-base leading-normal tracking-[-0.64px] shadow-none data-[size=default]:h-auto"
            />
          </DsFormField>

          <DsFormField label="Telefone" error={registerErrors.phone}>
            <DsInput
              type="tel"
              placeholder="(00) 00000-0000"
              value={registerPhone}
              onChange={handlePhoneChange}
              aria-invalid={!!registerErrors.phone}
              className="rounded-[6px] border-nova-gray-500 px-4 py-3 text-base leading-normal tracking-[-0.64px] shadow-none data-[size=default]:h-auto"
            />
          </DsFormField>

          <DsFormField label="Senha" error={registerErrors.password}>
            <DsPasswordInput
              placeholder="Digite sua senha"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              aria-invalid={!!registerErrors.password}
              className="rounded-[6px] border-nova-gray-500 px-4 py-3 text-base leading-normal tracking-[-0.64px] shadow-none data-[size=default]:h-auto"
            />
          </DsFormField>
        </div>

        <DsButton size="flow" disabled={!canSubmit} onClick={handleSubmit} className="w-[257px]">
          {isRegistering ? "Cadastrando..." : "Cadastrar e-mail"}
        </DsButton>

        <DsButton
          variant="outline"
          size="flow"
          onClick={() => router.push("/agendamento/dia-horario")}
          className="w-[257px] border-nova-gray-500 text-nova-gray-700"
        >
          Voltar
        </DsButton>
      </DsFlowCard>

      <DsPopup open={registerSuccess}>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
            E-mail cadastrado com sucesso!
          </h2>
          <p className="text-base leading-[1.5] text-nova-gray-700">
            Prossiga para o pagamento e conclua seu agendamento.
          </p>
        </div>
        <DsButton
          size="flow"
          onClick={() => router.push("/agendamento/pagamento")}
          className="w-[305px]"
        >
          Continuar
        </DsButton>
      </DsPopup>
    </>
  );
}
