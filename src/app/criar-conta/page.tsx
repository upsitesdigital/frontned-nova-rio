"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { DsButton, DsFormField, DsInput, DsLogo, DsPasswordInput } from "@/design-system";
import { FLOW_INPUT_CLASS } from "@/lib/constants";
import { formatPhone } from "@/lib/formatters";
import { useCreateAccountStore } from "@/stores/create-account-store";
import { usePasswordVisibilityStore } from "@/stores/password-visibility-store";

export default function CriarContaPage() {
  const router = useRouter();

  const name = useCreateAccountStore((s) => s.name);
  const email = useCreateAccountStore((s) => s.email);
  const phone = useCreateAccountStore((s) => s.phone);
  const password = useCreateAccountStore((s) => s.password);
  const confirmPassword = useCreateAccountStore((s) => s.confirmPassword);
  const isSubmitting = useCreateAccountStore((s) => s.isSubmitting);
  const errors = useCreateAccountStore((s) => s.errors);

  const setName = useCreateAccountStore((s) => s.setName);
  const setEmail = useCreateAccountStore((s) => s.setEmail);
  const setPhone = useCreateAccountStore((s) => s.setPhone);
  const setPassword = useCreateAccountStore((s) => s.setPassword);
  const setConfirmPassword = useCreateAccountStore((s) => s.setConfirmPassword);
  const submit = useCreateAccountStore((s) => s.submit);
  const reset = useCreateAccountStore((s) => s.reset);

  const pwdVisible = usePasswordVisibilityStore((s) => s.isVisible("register-password"));
  const confirmPwdVisible = usePasswordVisibilityStore((s) => s.isVisible("register-confirm"));
  const setPwdVisibility = usePasswordVisibilityStore((s) => s.setVisibility);

  useEffect(() => {
    reset();
  }, [reset]);

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
    confirmPassword.trim().length > 0 &&
    !isSubmitting;

  const handleSubmit = useCallback(async () => {
    const success = await submit();
    if (success) {
      router.push("/login");
    }
  }, [submit, router]);

  return (
    <div className="flex min-h-screen">
      <div className="relative flex w-1/2 flex-col items-center overflow-hidden">
        <DsLogo className="mt-15.25" />

        <div className="mt-12 flex w-full max-w-147.25 flex-col items-center gap-12">
          <h1 className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
            Crie sua conta
          </h1>

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
                visible={pwdVisible}
                onVisibilityChange={(v) => setPwdVisibility("register-password", v)}
                aria-invalid={!!errors.password}
                className={FLOW_INPUT_CLASS}
              />
            </DsFormField>

            <DsFormField label="Confirmar senha" error={errors.confirmPassword}>
              <DsPasswordInput
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                visible={confirmPwdVisible}
                onVisibilityChange={(v) => setPwdVisibility("register-confirm", v)}
                aria-invalid={!!errors.confirmPassword}
                className={FLOW_INPUT_CLASS}
              />
            </DsFormField>
          </div>

          <div className="flex flex-col items-start gap-6">
            <DsButton size="flow" disabled={!canSubmit} onClick={handleSubmit} className="w-64.25">
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </DsButton>

            <p className="text-base leading-normal text-nova-gray-700">
              Já possui uma conta?{" "}
              <Link href="/login" className="text-nova-primary underline">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>

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
    </div>
  );
}
