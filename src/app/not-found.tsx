import Link from "next/link";

import { DsButton, DsLogo } from "@/design-system";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-nova-gray-50 px-6 text-center">
      <DsLogo className="h-8 w-auto" />
      <p className="text-8xl font-bold leading-none text-nova-primary">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-nova-gray-900">Página não encontrada</h1>
        <p className="max-w-md text-base text-nova-gray-600">
          A página que você procura não existe ou foi movida.
        </p>
      </div>
      <DsButton asChild>
        <Link href="/">Voltar ao início</Link>
      </DsButton>
    </main>
  );
}
