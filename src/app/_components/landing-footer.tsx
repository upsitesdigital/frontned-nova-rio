import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-nova-gray-900 px-6 py-8">
      <div className="mx-auto flex max-w-304 flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-sm leading-normal text-white/70">
          ©{new Date().getFullYear()} Nova Rio Pay Per Use. Todos os direitos reservados.
        </p>
        <p className="text-sm leading-normal text-white/70">
          Criação de Sites por{" "}
          <Link
            href="https://upsites.digital/?origin=nova-rio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white underline underline-offset-2 transition-colors hover:text-white/80"
          >
            UpSites
          </Link>
        </p>
      </div>
    </footer>
  );
}
