"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { DsButton, DsFormField, DsInput, DsLogo, DsPasswordInput } from "@/design-system";
import { FLOW_INPUT_CLASS } from "@/lib/constants";
import { useLoginStore } from "@/stores/login-store";

import { PendingApprovalDialog } from "./_components/pending-approval-dialog";

export default function LoginPage() {
  const router = useRouter();

  const email = useLoginStore((s) => s.email);
  const password = useLoginStore((s) => s.password);
  const isSubmitting = useLoginStore((s) => s.isSubmitting);
  const error = useLoginStore((s) => s.error);

  const pendingApproval = useLoginStore((s) => s.pendingApproval);

  const setEmail = useLoginStore((s) => s.setEmail);
  const setPassword = useLoginStore((s) => s.setPassword);
  const submit = useLoginStore((s) => s.submit);
  const dismissPendingApproval = useLoginStore((s) => s.dismissPendingApproval);
  const reset = useLoginStore((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    const success = await submit();
    if (success) {
      router.push("/dashboard");
    }
  }, [submit, router]);

  return (
    <div className="flex min-h-screen">
      <div className="relative flex w-1/2 flex-col items-center overflow-hidden">
        <DsLogo className="mt-38.75" />

        <div className="mt-12 flex w-full max-w-147.25 flex-col items-center gap-12">
          <h1 className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
            Entrar
          </h1>

          <div className="flex w-full flex-col gap-4">
            <DsFormField label="E-mail">
              <DsInput
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={FLOW_INPUT_CLASS}
              />
            </DsFormField>

            <DsFormField label="Senha">
              <DsPasswordInput
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={FLOW_INPUT_CLASS}
              />
            </DsFormField>
          </div>

          <DsButton size="flow" disabled={!canSubmit} onClick={handleSubmit} className="w-64.25">
            {isSubmitting ? "Entrando..." : "Entrar"}
          </DsButton>
        </div>

        {error && <p className="mt-4 text-sm leading-normal text-nova-error">{error}</p>}

        <Link
          href="/esqueci-senha"
          className="mt-10 text-base leading-normal text-nova-gray-700 underline"
        >
          Esqueceu sua senha?
        </Link>

        <p className="mt-auto pb-26 text-base leading-normal tracking-[-0.64px] text-nova-gray-700">
          ©{new Date().getFullYear()} Nova Rio Pay Per Use
        </p>
      </div>

      <div className="relative w-1/2 bg-nova-gray-700">
        <Image
          src="/images/woman-cleaner.png"
          alt="Profissional de limpeza"
          fill
          className="object-cover"
          priority
        />
      </div>

      <PendingApprovalDialog open={pendingApproval} onClose={dismissPendingApproval} />
    </div>
  );
}
