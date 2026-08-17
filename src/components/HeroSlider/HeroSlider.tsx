"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Link from "next/link";
import { slides } from "@/data/slides";

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
        }}
        loop
      >

        {slides.map((slide) => (

          <SwiperSlide key={slide.id}>

            <div className="relative h-[700px]">

              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center">

                <div className="mx-auto w-full max-w-7xl px-8">

                  <p className="mb-5 uppercase tracking-[6px] text-red-500">

                    {slide.brand}

                  </p>

                  <h1 className="max-w-xl text-6xl font-black leading-tight text-white">

                    {slide.title}

                  </h1>

                  <p className="mt-8 max-w-lg text-xl text-gray-200">

                    {slide.subtitle}

                  </p>

                  <Link
                      href={slide.href}
                      className="mt-10 inline-flex rounded-xl bg-white px-10 py-4 font-bold text-black transition hover:bg-red-600 hover:text-white">

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