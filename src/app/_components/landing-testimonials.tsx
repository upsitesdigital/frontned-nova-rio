"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const TESTIMONIALS = [
  {
    stars: 5,
    quote:
      "Finalmente encontrei uma solução de limpeza que combina flexibilidade e qualidade. Nossos clientes percebem a diferença.",
    author: "Escritório de advocacia no Le Monde.",
  },
  {
    stars: 5,
    quote:
      "A pontualidade e o profissionalismo da equipe são impecáveis. Recomendo para qualquer empresa que valoriza um ambiente impecável.",
    author: "Clínica de estética no Leblon.",
  },
  {
    stars: 5,
    quote:
      "O sistema de pagamento simplificado e o agendamento rápido tornaram a gestão da limpeza muito mais fácil para nós.",
    author: "Startup em condomínio corporativo.",
  },
  {
    stars: 5,
    quote:
      "A limpeza recorrente trouxe padronização e tranquilidade para nossa operação. O time entrega excelência em cada visita.",
    author: "Escritório de consultoria na Barra.",
  },
  {
    stars: 5,
    quote:
      "A experiência é premium do início ao fim: agendamento simples, equipe cuidadosa e atendimento sempre muito eficiente.",
    author: "Consultório médico em Ipanema.",
  },
];

function LandingTestimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  const testimonial = TESTIMONIALS[current];
  const dotsCount = 5;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-304 px-6">
        <div className="mx-auto mb-12 flex max-w-200 flex-col items-center gap-6 text-center">
          <p className="text-base leading-[1.2] font-semibold tracking-[1.6px] text-nova-primary-dark uppercase">
            Depoimentos
          </p>
          <h2 className="text-[36px] leading-[1.3] font-medium tracking-[-1.44px] text-black">
            Empresas que confiam na Nova Rio
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[488px_1fr]">
          <div className="relative h-115 overflow-hidden bg-nova-gray-700">
            <Image
              src="/images/landing/handshake.jpg"
              alt="Parceiros em reunião corporativa"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-nova-gray-700/15" />
            <div className="absolute bottom-14 left-9 h-15.25 w-4.5 bg-nova-primary" />
          </div>

          <div className="flex h-115 flex-col border border-nova-gray-300 px-10.5 py-14">
            <div className="flex flex-1 flex-col gap-10">
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} size={20} weight="fill" className="text-[#f5d025]" />
                ))}
              </div>

              <blockquote className="text-2xl leading-normal font-normal tracking-[-0.96px] text-black">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex h-14 items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-nova-primary-light">
                  <span className="text-lg font-semibold text-nova-primary-dark">
                    {testimonial.author[0]}
                  </span>
                </div>
                <p className="text-base leading-normal font-medium text-black">{testimonial.author}</p>
              </div>
            </div>

            <div className="mt-9 flex items-center justify-between">
              <div className="flex items-center gap-2.25 px-2.5 py-2.5">
                {Array.from({ length: dotsCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i % TESTIMONIALS.length)}
                    className={`size-2 rounded-full ${i === current ? "bg-nova-primary" : "bg-[#cccccc]"}`}
                    aria-label={`Depoimento ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-8">
                <button
                  onClick={prev}
                  className="flex size-12 items-center justify-center rounded-full border border-nova-primary bg-white opacity-30"
                  aria-label="Depoimento anterior"
                >
                  <ArrowLeft size={20} className="text-nova-primary-dark" />
                </button>
                <button
                  onClick={next}
                  className="flex size-12 items-center justify-center rounded-full border border-nova-primary bg-white"
                  aria-label="Próximo depoimento"
                >
                  <ArrowRight size={20} className="text-nova-primary-dark" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { LandingTestimonials };
