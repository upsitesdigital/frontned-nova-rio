import Link from "next/link";

import { DsButton } from "@/design-system";

function SuccessStep() {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <p className="text-center text-base leading-normal tracking-[-0.64px] text-nova-primary-dark">
        Senha redefinida com sucesso!
      </p>
      <DsButton variant="outline" size="flow" asChild className="w-64.25">
        <Link href="/login">Voltar para o login</Link>
      </DsButton>
    </div>
  );
}

export { SuccessStep };
