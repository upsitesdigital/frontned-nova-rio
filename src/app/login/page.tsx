"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { DsButton, DsFormField, DsInput, DsLogo, DsPasswordInput } from "@/design-system";
import { Constants } from "@/lib/core/constants";
import { useLoginStore } from "@/stores/auth/login-store";
import { usePasswordVisibilityStore } from "@/stores/auth/password-visibility-store";

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

  const pwdVisible = usePasswordVisibilityStore((s) => s.isVisible("login-password"));
  const setPwdVisible = usePasswordVisibilityStore((s) => s.setVisibility);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleSubmit = useCallback(async () => {
    const userType = await submit();
    if (userType === "admin") {
      router.push("/admin");
    } else if (userType === "client") {
      router.push("/dashboard");
    }
  }, [submit, router]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative flex w-full flex-col items-center overflow-hidden px-6 md:w-1/2 md:px-0">
        <DsLogo className="mt-16 md:mt-38.75" />

        <div className="mt-12 flex w-full max-w-147.25 flex-col items-center gap-12">
          <h1 className="text-2xl font-medium leading-[1.3] tracking-[-1.44px] sm:text-4xl text-black">
            Entrar
          </h1>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
            className="flex w-full flex-col items-center gap-12"
          >
            <div className="flex w-full flex-col gap-4">
              <DsFormField label="E-mail">
                <DsInput
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={Constants.flowInputClass}
                />
              </DsFormField>

              <DsFormField label="Senha">
                <DsPasswordInput
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  visible={pwdVisible}
                  onVisibilityChange={(v) => setPwdVisible("login-password", v)}
                  className={Constants.flowInputClass}
                />
              </DsFormField>
            </div>

            <DsButton type="submit" size="flow" disabled={isSubmitting} className="w-64.25">
              {isSubmitting ? "Entrando..." : "Entrar"}
            </DsButton>
          </form>
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

      <div className="relative hidden w-1/2 bg-nova-gray-700 md:block">
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
