import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesse sua conta Nova Rio para gerenciar seus agendamentos de limpeza empresarial sob demanda.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
