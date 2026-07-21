import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Senha",
  description: "Redefina sua senha de acesso à plataforma Nova Rio Pay Per Use.",
  robots: { index: false, follow: false },
};

export default function EsqueciSenhaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
