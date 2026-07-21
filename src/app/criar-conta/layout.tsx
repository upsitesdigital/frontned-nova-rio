import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta",
  description:
    "Crie sua conta na Nova Rio e agende serviços de limpeza empresarial pay per use para sua empresa.",
};

export default function CriarContaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
