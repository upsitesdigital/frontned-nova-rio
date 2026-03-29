"use client";

import Link from "next/link";
import {
  ArrowRight,
  Broom,
  DeviceMobileCamera,
  UsersThree,
  CurrencyDollar,
} from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { DsButton, DsIcon } from "@/design-system";
import { LandingNavbar } from "./landing-navbar";

const HOW_IT_WORKS_STEPS = [
  {
    icon: Broom,
    title: "Escolha o serviço",
    description: "Selecione faxina regular ou limpeza recorrente.",
  },
  {
    icon: DeviceMobileCamera,
    title: "Agende online",
    description: "Escolha data e horário com antecedência mínima de 1h.",
  },
  {
    icon: UsersThree,
    title: "Equipe especializada",
    description: "Profissionais uniformizados e treinados chegam até você.",
  },
  {
    icon: CurrencyDollar,
    title: "Pagamento facilitado",
    description: "Cobrança automática, sem burocracia e sem inadimplência.",
  },
] as const;

function LandingHero() {
  return (
    <section className="relative min-h-214 overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/landing/bg-hero.png')" }}
      />

      <LandingNavbar />

      <div className="relative z-10 mx-auto flex max-w-304 flex-col items-center px-6 pb-24 pt-49 text-center">
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
            <h1 className="max-w-177.75 text-[42px] leading-[1.05] font-normal tracking-[-2.24px] md:text-[56px]">
              Limpeza empresarial sob demanda no padrão que sua empresa merece
            </h1>
            <p className="max-w-225.75 text-lg leading-normal tracking-[-0.8px] text-white md:text-[20px]">
              Serviços de limpeza <span className="font-semibold">pay per use</span> para
              escritórios e consultórios de alto padrão, com agendamento rápido,
              pagamento simplificado e profissionais qualificados.
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
                <ArrowRight
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

function LandingHowItWorks() {
  return (
    <section className="bg-nova-gray-100 py-30">
      <div className="mx-auto max-w-304 px-6">
        <motion.div
          className="mx-auto mb-16 flex max-w-200 flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-base leading-[1.2] font-semibold tracking-[3.2px] text-nova-primary-dark uppercase">
            Como Funciona
          </p>
          <h2 className="text-[36px] leading-[1.3] font-medium tracking-[-1.44px] text-black">
            Agendamento em minutos, serviço impecável sempre que precisar.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <motion.article
              key={step.title}
              className="flex h-63.75 flex-col items-center bg-white px-2 pt-8 text-center transition-shadow duration-300 hover:shadow-[0_18px_30px_-18px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <motion.div
                className="flex size-16 items-center justify-center rounded-full bg-nova-primary-light"
                whileHover={{ rotate: -6, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <DsIcon icon={step.icon} size="xl" className="text-nova-primary-dark" />
              </motion.div>

              <div className="mt-6 flex w-full max-w-69 flex-col items-center gap-2">
                <h3 className="text-2xl leading-[1.3] font-medium tracking-[-0.96px] text-black">
                  {step.title}
                </h3>
                <p className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { LandingHero, LandingHowItWorks };
