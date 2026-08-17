"use client";

import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import ProductCard from "@/components/ProductCard/ProductCard";

import { Product } from "@/types/product";

export default function ProductSlider() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {

    async function loadProducts() {

      const response = await fetch("/api/products");

      const data = await response.json();

      setProducts(data);

    }

    loadProducts();

  }, []);

  return (

    <Swiper
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >

      {products.map((product) => (

        <SwiperSlide key={product.id}>

          <ProductCard
            {...product}
          />

        </SwiperSlide>

      ))}

    </Swiper>

  );

}