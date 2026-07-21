import type { Metadata, Viewport } from "next";
import { Work_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Nova Rio — Limpeza pay per use para escritórios e consultórios",
  description:
    "Serviços de limpeza pay per use para escritórios e consultórios de alto padrão, com agendamento rápido, pagamento simplificado e profissionais qualificados.",
  openGraph: {
    title: "Nova Rio — Limpeza pay per use",
    description:
      "Agende sua limpeza empresarial sob demanda: escritórios e consultórios de alto padrão.",
    type: "website",
    locale: "pt_BR",
    siteName: "Nova Rio",
    images: [{ url: "/images/woman-cleaner.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${workSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
