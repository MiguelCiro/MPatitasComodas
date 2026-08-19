"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#070708] text-white">
      {/* Fondo ambiental */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-red-glow hero-red-glow-one" />
        <div className="hero-red-glow hero-red-glow-two" />
        <div className="hero-grid" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        {/* ================================= */}
        {/* TEXTO */}
        {/* ================================= */}

        <div className="relative z-10 max-w-2xl">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[3px] text-red-500 sm:text-xs sm:tracking-[5px]">
            Premium Sneakers · Envíos a toda Colombia
          </p>

          <h1 className="max-w-xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Sneakers que
            <br />
            marcan la
            <br />
            diferencia.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-gray-300 sm:text-lg">
            Nike, Jordan, Adidas, New Balance y más.
          </p>

          <p className="mt-2 max-w-lg text-base leading-7 text-gray-400 sm:text-lg">
            Modelos seleccionados para quienes buscan comodidad,
            calidad y estilo.
          </p>

          {/* Botones */}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/productos"
              className="flex min-h-14 items-center justify-center rounded-xl bg-red-600 px-8 font-bold text-white transition duration-300 hover:scale-[1.02] hover:bg-red-500 hover:shadow-[0_0_35px_rgba(220,38,38,0.45)]"
            >
              Explorar colección
            </Link>

            <Link
              href="/lanzamientos"
              className="flex min-h-14 items-center justify-center rounded-xl border border-white/25 bg-white/[0.03] px-8 font-bold text-white transition duration-300 hover:border-red-500/60 hover:bg-white/[0.08]"
            >
              Ver novedades
            </Link>
          </div>
        </div>

        {/* ================================= */}
        {/* ESCENA DEL SNEAKER */}
        {/* ================================= */}

        <div className="relative flex min-h-[470px] items-center justify-center sm:min-h-[560px] lg:min-h-[680px]">
          {/* Aura trasera */}

          <div className="hero-sneaker-aura" />

          {/* Partículas */}

          <span className="hero-particle hero-particle-1" />
          <span className="hero-particle hero-particle-2" />
          <span className="hero-particle hero-particle-3" />
          <span className="hero-particle hero-particle-4" />
          <span className="hero-particle hero-particle-5" />
          <span className="hero-particle hero-particle-6" />
          <span className="hero-particle hero-particle-7" />
          <span className="hero-particle hero-particle-8" />

          {/* Glow debajo del sneaker */}

          <div className="hero-floor-glow" />

          {/* Sneaker */}

          <div className="hero-sneaker-wrapper">
            <Image
              /*
               * CAMBIA ESTA RUTA POR LA IMAGEN
               * DEL SNEAKER QUE VAS A UTILIZAR
               *
               * Lo ideal:
               * /images/hero/jordan-floating.jpg
               *
               * JPG o PNG con fondo transparente.
               */
              src="/images/hero/jordan-flotating.png"
              alt="Sneaker premium KickDistrict"
              width={800}
              height={800}
              priority
              className="hero-sneaker relative z-20 h-auto w-full object-contain"
            />
          </div>

          {/* Sombra */}

          <div className="hero-sneaker-shadow" />

          {/* Plataforma */}

          <div className="hero-platform">
            <div className="hero-platform-top" />
            <div className="hero-platform-front" />
          </div>
        </div>
      </div>
    </section>
  );
}