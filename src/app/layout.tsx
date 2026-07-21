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

const SITE_TITLE = "Limpeza Empresarial Sob Demanda | Nova Rio Pay Per Use";
const SITE_DESCRIPTION =
  "Limpeza empresarial pay per use para escritórios, consultórios e clínicas de alto padrão. Agende online e conte com profissionais qualificados.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: SITE_TITLE,
    template: "%s | Nova Rio",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: "Nova Rio",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
