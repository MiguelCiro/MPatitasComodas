"use client";

import { useContext, useState } from "react";

import Image from "next/image";
import { Heart } from "lucide-react";

import { Product } from "@/types/product";

import ProductDrawer from "@/components/ProductDrawer/ProductDrawer";

import { FavoritesContext } from "@/context/FavoritesContext";

export default function ProductCard(product: Product) {
  const [open, setOpen] = useState(false);

  const {
    isFavorite,
    toggleFavorite,
  } = useContext(FavoritesContext);

  const favorite = isFavorite(product.id);

  function handleFavorite(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();

    toggleFavorite(product);
  }

  return (
    <>
      <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
        {/* ================================= */}
        {/* IMAGEN */}
        {/* ================================= */}

        <div
          onClick={() => setOpen(true)}
          className="relative h-60 cursor-pointer bg-gray-100 sm:h-72"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-5 transition duration-500 group-hover:scale-110 sm:p-8"
          />

          {/* FAVORITO */}

          <button
            type="button"
            onClick={handleFavorite}
            aria-label={
              favorite
                ? "Quitar de favoritos"
                : "Agregar a favoritos"
            }
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 sm:right-4 sm:top-4 sm:h-11 sm:w-11"
          >
            <Heart
              size={20}
              className={
                favorite
                  ? "fill-red-600 text-red-600"
                  : "text-gray-800"
              }
            />
          </button>
        </div>

        {/* ================================= */}
        {/* INFORMACIÓN */}
        {/* ================================= */}

        <div className="p-5 sm:p-6">

          <h3 className="mt-2 text-xl font-bold leading-tight text-gray-900 sm:text-xl">
            {product.name}
          </h3>

          <p className="mt-3 text-2xl font-black text-gray-900 sm:mt-4">
            ${product.price.toLocaleString("es-CO")}
          </p>
        </div>

        {/* ================================= */}
        {/* BOTÓN */}
        {/* ================================= */}

        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-red-600 sm:py-4"
          >
            Comprar
          </button>
        </div>
      </div>

      {/* ================================= */}
      {/* PRODUCT DRAWER */}
      {/* ================================= */}

      <ProductDrawer
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}