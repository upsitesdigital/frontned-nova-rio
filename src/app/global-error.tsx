"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

import "./globals.css";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
          <h1 className="text-2xl font-medium text-black sm:text-3xl">Algo deu errado</h1>
          <p className="max-w-md text-base text-nova-gray-700">
            Não foi possível carregar esta página. Tente novamente em instantes.
          </p>
          <Link href="/" className="text-base font-medium text-nova-primary underline">
            Voltar para o início
          </Link>
        </div>
      </body>
    </html>
  );
}
