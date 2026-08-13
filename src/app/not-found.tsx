import type { Metadata } from "next";
import Link from "next/link";
import { HouseIcon } from "@phosphor-icons/react/dist/ssr";

import { DsButton, DsLogo } from "@/design-system";
import { DsIcon } from "@/design-system/media";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 text-center">
      <DsLogo className="h-14! w-auto!" />
      <div className="flex flex-col items-center gap-4">
        <p className="text-7xl font-medium leading-none tracking-[-2px] text-nova-primary sm:text-8xl">
          404
        </p>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-medium text-black sm:text-3xl">Página não encontrada</h1>
          <p className="max-w-md text-base text-nova-gray-700">
            A página que você está procurando não existe ou foi movida para outro endereço.
          </p>
        </div>
      </div>
      <DsButton asChild size="flow" className="h-14 px-8">
        <Link href="/" className="inline-flex items-center justify-center gap-2">
          <DsIcon icon={HouseIcon} size="md" className="text-white" />
          Voltar para o início
        </Link>
      </DsButton>
    </div>
  );
}
