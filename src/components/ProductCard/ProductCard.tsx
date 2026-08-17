"use client";

import { useState } from "react";

import Image from "next/image";

import {
  Heart,
} from "lucide-react";

import { Product } from "@/types/product";

import ProductDrawer from "@/components/ProductDrawer/ProductDrawer";

import { useContext } from "react";

import { FavoritesContext } from "@/context/FavoritesContext";

export default function ProductCard(
  product: Product
) {
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

        {/* IMAGEN */}
        <div
          onClick={() => setOpen(true)}
          className="relative h-72 cursor-pointer bg-gray-100"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
            className="object-contain p-8 transition duration-500 group-hover:scale-110"
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
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
          >
            <Heart
              size={21}
              className={
                favorite
                  ? "fill-red-600 text-red-600"
                  : "text-gray-800"
              }
            />
          </button>
        </div>

        {/* INFORMACIÓN */}
        <div className="p-6">

          <p className="text-sm uppercase tracking-wider text-red-600">
            {product.brand.name}
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {product.name}
          </h3>

          <p className="mt-4 text-2xl font-black">
            $
            {product.price.toLocaleString(
              "es-CO"
            )}
          </p>

        </div>

        {/* BOTÓN */}
        <div className="px-6 pb-6">

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-red-600"
          >
            Comprar
          </button>

        </div>

      </div>

      {/* PRODUCT DRAWER */}
      <ProductDrawer
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}