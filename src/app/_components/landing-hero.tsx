"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { DsButton } from "@/design-system";
import { LandingNavbar } from "./landing-navbar";

export function LandingHero() {
  return (
    <section className="relative min-h-150 overflow-hidden bg-black md:min-h-214">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/landing/bg-hero.png')" }}
      />

      <LandingNavbar />

      <div className="relative z-10 mx-auto flex max-w-304 flex-col items-center px-6 pb-24 pt-32 text-center md:pt-49">
        <motion.div
          className="flex max-w-225.75 flex-col items-center gap-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
            <span className="text-[20px] leading-normal font-semibold tracking-[-0.8px] text-white">
              Nova Rio Pay Per Use
            </span>
            <span className="h-5 w-px bg-white/60" />
            <span className="text-[20px] leading-normal tracking-[-0.8px] text-white">
              Serviços de Limpeza
            </span>
          </motion.div>

          <div className="flex flex-col items-center gap-4 text-white">
            <h1 className="max-w-177.75 text-[32px] leading-[1.05] font-normal tracking-[-2.24px] sm:text-[42px] md:text-[56px]">
              Limpeza empresarial sob demanda no padrão que sua empresa merece
            </h1>
            <p className="max-w-225.75 text-lg leading-normal tracking-[-0.8px] text-white md:text-[20px]">
              Serviços de limpeza <span className="font-semibold">pay per use</span> para
              escritórios e consultórios de alto padrão, com agendamento rápido, pagamento
              simplificado e profissionais qualificados.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <DsButton
              asChild
              size="flow"
              className="h-15 rounded-xl bg-linear-to-r from-nova-primary-dark to-nova-primary px-8 text-lg tracking-[-0.72px]"
            >
              <Link href="/agendamento" className="group flex items-center gap-4">
                Agende sua limpeza agora
                <ArrowRightIcon
                  size={20}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </DsButton>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-px bg-white/10" />
    </section>
  );
}
