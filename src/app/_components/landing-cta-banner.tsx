"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { DsButton } from "@/design-system";

function LandingCTABanner() {
  return (
    <section className="relative min-h-135 overflow-hidden bg-[#049765]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-90 opacity-70">
        <Image
          src="/images/landing/left-rigth-footer.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 w-90 opacity-70">
        <Image
          src="/images/landing/left-rigth-footer.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-135 max-w-304 items-center justify-center px-6 py-14">
        <motion.div
          className="w-full max-w-122.75 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-[52px] font-medium leading-none tracking-[-1.04px] text-white">
            Fale com a Nova Rio Pay Per Use
          </h2>
          <p className="mx-auto mb-8 max-w-122.75 text-base font-normal leading-normal text-white/90">
            Quer conhecer mais sobre nossos serviços? Entre em contato.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.985 }}>
            <DsButton
              asChild
              size="flow"
              className="h-14.75 w-76.5 rounded-xl bg-black px-8 text-base hover:bg-black/90"
            >
              <Link href="/agendamento" className="group inline-flex items-center justify-center gap-2">
                Agende sua limpeza agora
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </DsButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export { LandingCTABanner };
