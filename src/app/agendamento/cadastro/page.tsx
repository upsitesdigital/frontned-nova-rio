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
import { FLOW_INPUT_CLASS } from "@/lib/constants";
import { formatPhone } from "@/lib/formatters";
import { useRegistrationStore } from "@/stores/registration-store";

export default function CadastroPage() {
  const router = useRouter();

  const name = useRegistrationStore((s) => s.name);
  const email = useRegistrationStore((s) => s.email);
  const phone = useRegistrationStore((s) => s.phone);
  const password = useRegistrationStore((s) => s.password);
  const isRegistering = useRegistrationStore((s) => s.isRegistering);
  const errors = useRegistrationStore((s) => s.errors);
  const success = useRegistrationStore((s) => s.success);

  const setName = useRegistrationStore((s) => s.setName);
  const setEmail = useRegistrationStore((s) => s.setEmail);
  const setPhone = useRegistrationStore((s) => s.setPhone);
  const setPassword = useRegistrationStore((s) => s.setPassword);
  const submit = useRegistrationStore((s) => s.submit);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(formatPhone(e.target.value));
    },
    [setPhone],
  );

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length >= 8 &&
    !isRegistering;

  const handleSubmit = useCallback(async () => {
    await submit();
  }, [submit]);

  return (
    <>
      <DsFlowCard className="mx-auto max-w-[1008px]">
        <DsFlowHeader
          title="Cadastrar e-mail"
          subtitle="Cadastre seu e-mail para prosseguir com o pagamento."
        />

        <div className="flex w-full flex-col gap-4">
          <DsFormField label="Nome" error={errors.name}>
            <DsInput
              placeholder="Digite seu Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              className={FLOW_INPUT_CLASS}
            />
          </DsFormField>

          <DsFormField label="E-mail" error={errors.email}>
            <DsInput
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              className={FLOW_INPUT_CLASS}
            />
          </DsFormField>

          <DsFormField label="Telefone" error={errors.phone}>
            <DsInput
              type="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={handlePhoneChange}
              aria-invalid={!!errors.phone}
              className={FLOW_INPUT_CLASS}
            />
          </DsFormField>

          <DsFormField label="Senha" error={errors.password}>
            <DsPasswordInput
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              className={FLOW_INPUT_CLASS}
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

      <DsPopup open={success}>
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
