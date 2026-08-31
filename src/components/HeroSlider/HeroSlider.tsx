"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { slides } from "@/data/slides";

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
        ]}
        navigation
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="hero-slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="
                relative
                h-[560px]
                overflow-hidden
                sm:h-[620px]
                lg:h-[700px]
              "
            >
              {/* =================================
                  IMAGEN
              ================================= */}

              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />

              {/* =================================
                  OSCURECIMIENTO
              ================================= */}

              <div className="absolute inset-0 bg-black/45" />

              {/* =================================
                  CONTENIDO
              ================================= */}

              <div className="absolute inset-0 flex items-center">
                <div
                  className="
                    mx-auto
                    w-full
                    max-w-7xl
                    px-5
                    sm:px-8
                    lg:px-8
                  "
                >
                  {/* BRAND */}

                  <p
                    className="
                      mb-4
                      max-w-full
                      text-[10px]
                      font-bold
                      uppercase
                      leading-5
                      tracking-[3px]
                      text-red-500
                      sm:mb-5
                      sm:text-xs
                      sm:tracking-[6px]
                    "
                  >
                    {slide.brand}
                  </p>

                  {/* =================================
                      TÍTULO
                  ================================= */}

                  <h2
                    className="
                      max-w-[calc(100vw-40px)]
                      break-words
                      text-4xl
                      font-black
                      leading-[0.98]
                      tracking-[-0.03em]
                      text-white
                      sm:max-w-xl
                      sm:text-5xl
                      sm:leading-tight
                      sm:tracking-tight
                      lg:text-6xl
                    "
                  >
                    {slide.title}
                  </h2>

                  {/* =================================
                      DESCRIPCIÓN
                  ================================= */}

                  <p
                    className="
                      mt-5
                      max-w-[330px]
                      text-base
                      leading-7
                      text-gray-200
                      sm:mt-8
                      sm:max-w-lg
                      sm:text-xl
                    "
                  >
                    {slide.subtitle}
                  </p>

                  {/* =================================
                      BOTÓN
                  ================================= */}

                  <Link
                    href={slide.href}
                    className="
                      mt-7
                      inline-flex
                      min-h-14
                      max-w-full
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      px-7
                      py-4
                      text-center
                      text-sm
                      font-bold
                      leading-5
                      text-black
                      transition
                      duration-300
                      hover:bg-red-600
                      hover:text-white
                      sm:mt-10
                      sm:px-10
                      sm:text-base
                    "
                  >
                    {slide.button}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}