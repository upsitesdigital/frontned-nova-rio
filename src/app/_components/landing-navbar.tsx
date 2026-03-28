import Image from "next/image";
import Link from "next/link";

function LandingNavbar() {
  return (
    <header className="absolute top-0 right-0 left-0 z-20">
      <div className="mx-auto flex max-w-304 items-center justify-between px-6 py-6">
        <Image
          src="/logo/logo-white.svg"
          alt="Nova Rio"
          width={200}
          height={108}
          className="h-auto w-35 md:w-42.5 lg:w-50"
          priority
        />
        <Link
          href="/login"
          className="rounded-xl border border-white/30 bg-white/5 px-5 py-2.5 text-base tracking-[-0.64px] text-white backdrop-blur-[20px] transition-colors hover:bg-white/10 md:text-lg md:tracking-[-0.72px]"
        >
          Já tem conta? <span className="underline underline-offset-2">Entrar</span>
        </Link>
      </div>
    </header>
  );
}

export { LandingNavbar };
