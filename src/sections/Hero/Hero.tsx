"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#070708] text-white">
      {/* =========================================
          FONDO AMBIENTAL
      ========================================= */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-red-glow hero-red-glow-one" />
        <div className="hero-red-glow hero-red-glow-two" />
        <div className="hero-grid" />
      </div>

      {/* =========================================
          CONTENIDO
      ========================================= */}

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">

        {/* =====================================
            TEXTO
        ===================================== */}

        <div className="relative z-10 max-w-2xl">

          {/* TEXTO SUPERIOR */}

          <p className="mb-5 max-w-full text-[9px] font-bold uppercase leading-5 tracking-[2.5px] text-red-500 sm:text-xs sm:tracking-[5px]">
            ¡Estrena Medias Hoy! · Envíos Nacionales
          </p>

          {/* TÍTULO */}

          <h1
            className="
              max-w-full
              text-[2.65rem]
              font-black
              leading-[0.98]
              tracking-[-0.04em]
              text-white
              sm:max-w-xl
              sm:text-6xl
              sm:tracking-tight
              lg:text-7xl
              xl:text-8xl
            "
          >
            Every step
            <br />
            deserves its
            <br />
            own style.
          </h1>

          {/* DESCRIPCIÓN */}

          <p className="mt-6 max-w-lg text-[15px] leading-7 text-gray-300 sm:text-lg">
            Calcetines con diseños únicos para cada personalidad.
          </p>

          <p className="mt-2 max-w-lg text-[15px] leading-7 text-gray-400 sm:text-lg">
            Comodidad, color y estilo para acompañarte en cada paso.
          </p>

          {/* =====================================
              BOTONES
          ===================================== */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              href="/ofertas"
              className="
                flex
                min-h-14
                w-full
                items-center
                justify-center
                rounded-xl
                bg-red-600
                px-6
                text-base
                font-bold
                text-white
                transition
                duration-300
                hover:scale-[1.02]
                hover:bg-red-500
                hover:shadow-[0_0_35px_rgba(220,38,38,0.45)]
                sm:w-auto
                sm:px-8
              "
            >
              Explorar Ofertas
            </Link>

            <Link
              href="/lanzamientos"
              className="
                flex
                min-h-14
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-white/25
                bg-white/[0.03]
                px-6
                text-base
                font-bold
                text-white
                transition
                duration-300
                hover:border-red-500/60
                hover:bg-white/[0.08]
                sm:w-auto
                sm:px-8
              "
            >
              Nuevos Estilos
            </Link>

          </div>
        </div>

        {/* =====================================
            ESCENA DE LA MEDIA
        ===================================== */}

        <div
          className="
            relative
            flex
            min-h-[390px]
            items-center
            justify-center
            sm:min-h-[560px]
            lg:min-h-[680px]
          "
        >

          {/* AURA */}

          <div className="hero-sneaker-aura" />

          {/* PARTÍCULAS */}

          <span className="hero-particle hero-particle-1" />
          <span className="hero-particle hero-particle-2" />
          <span className="hero-particle hero-particle-3" />
          <span className="hero-particle hero-particle-4" />
          <span className="hero-particle hero-particle-5" />
          <span className="hero-particle hero-particle-6" />
          <span className="hero-particle hero-particle-7" />
          <span className="hero-particle hero-particle-8" />

          {/* =================================
              IMAGEN
          ================================= */}

          <div className="hero-sneaker-wrapper">
            <Image
              src="/images/hero/logo-flotante.png"
              alt="Calcetín MPatitas Cómodas flotando"
              width={800}
              height={800}
              priority
              className="
                hero-sneaker
                relative
                z-20
                h-auto
                w-full
                object-contain
              "
            />
          </div>

          {/* SOMBRA */}

          <div className="hero-sneaker-shadow" />

          {/* PLATAFORMA */}

          <div className="hero-platform">
            <div className="hero-platform-top" />
            <div className="hero-platform-front" />
          </div>

        </div>

      </div>
    </section>
  );
}