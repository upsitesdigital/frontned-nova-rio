"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { DsLogo } from "@/design-system";
import { useForgotPasswordStore } from "@/stores/auth/forgot-password-store";

import { EmailStep } from "./_components/email-step";
import { CodeStep } from "./_components/code-step";
import { SuccessStep } from "./_components/success-step";

const stepConfig = {
  email: {
    title: "Esqueceu sua senha?",
    subtitle: "Informe seu e-mail e enviaremos um código para redefinir sua senha.",
  },
  code: {
    title: "Verificação",
    subtitle: "Digite o código enviado para seu e-mail e defina sua nova senha.",
  },
  success: {
    title: "Tudo certo!",
    subtitle: "",
  },
} as const;

export default function ForgotPasswordPage() {
  const step = useForgotPasswordStore((s) => s.step);
  const error = useForgotPasswordStore((s) => s.error);
  const reset = useForgotPasswordStore((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  const { title, subtitle } = stepConfig[step];

  return (
    <div className="flex min-h-screen flex-col md:h-screen md:flex-row">
      <div className="flex w-full flex-col items-center overflow-y-auto px-6 md:w-1/2 md:px-0">
        <DsLogo className="mt-16 md:mt-38.75" />

        <div className="mt-12 flex w-full max-w-147.25 flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-medium leading-[1.3] tracking-[-1.44px] sm:text-4xl text-black">
              {title}
            </h1>
            {subtitle && (
              <p className="text-center text-base leading-normal tracking-[-0.64px] text-nova-gray-700">
                {subtitle}
              </p>
            )}
          </div>

          {step === "email" && <EmailStep />}
          {step === "code" && <CodeStep />}
          {step === "success" && <SuccessStep />}
        </div>

        {error && <p className="mt-4 text-sm leading-normal text-nova-error">{error}</p>}

        {step !== "success" && (
          <Link
            href="/login"
            className="mt-10 text-base leading-normal text-nova-gray-700 underline"
          >
            Voltar para o login
          </Link>
        )}

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
    </div>
  );
}
