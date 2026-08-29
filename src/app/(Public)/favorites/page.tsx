"use client";

import {
  useContext,
} from "react";

import {
  Heart,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import Link from "next/link";

import Image from "next/image";

import { FavoritesContext } from "@/context/FavoritesContext";

export default function FavoritesPage() {
  const {
    favorites,
    removeFavorite,
    clearFavorites,
  } = useContext(FavoritesContext);

  /*
   * SIN FAVORITOS
   */
  if (favorites.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5 py-20">

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Heart
              size={34}
              className="text-gray-400"
            />
          </div>

          <h1 className="mt-8 text-4xl font-black">
            Tus favoritos están vacíos
          </h1>

          <p className="mx-auto mt-4 max-w-md text-gray-500">
            Guarda los sneakers que más te gusten
            y encuéntralos fácilmente aquí.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-7 py-4 font-bold text-white transition hover:bg-red-600"
          >
            <ShoppingBag size={20} />
            Explorar productos
          </Link>

        </div>

      </main>
    );
  }

  /*
   * CON FAVORITOS
   */
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

      {/* HEADER */}
      <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>

          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            MPATITAS COMODAS
          </p>

          <h1 className="mt-2 text-5xl font-black">
            Mis favoritos
          </h1>

          <p className="mt-3 text-gray-500">
            {favorites.length}{" "}
            {favorites.length === 1
              ? "producto guardado"
              : "productos guardados"}
          </p>

        </div>

        <button
          type="button"
          onClick={clearFavorites}
          className="flex items-center gap-2 self-start rounded-xl border border-gray-200 px-5 py-3 font-semibold transition hover:border-red-600 hover:text-red-600 sm:self-auto"
        >
          <Trash2 size={18} />
          Limpiar favoritos
        </button>

      </div>

      {/* PRODUCTOS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {favorites.map((product) => (

          <div
            key={product.id}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
          >

            {/* IMAGEN */}
            <Link
              href={`/product/${product.slug}`}
              className="relative block h-72 bg-gray-100"
            >

              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                className="object-contain p-8 transition duration-500 group-hover:scale-105"
              />

            </Link>

            {/* INFORMACIÓN */}
            <div className="p-6">

              <p className="text-sm uppercase tracking-wider text-red-600">
                {product.name}
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {product.name}
              </h2>

              <p className="mt-3 text-2xl font-black">
                $
                {product.price.toLocaleString(
                  "es-CO"
                )}
              </p>

              {/* ACCIONES */}
              <div className="mt-5 flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    removeFavorite(product.id)
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 transition hover:border-red-600 hover:text-red-600"
                  aria-label="Eliminar de favoritos"
                >
                  <Heart
                    size={20}
                    className="fill-red-600 text-red-600"
                  />
                </button>

                <Link
                  href={`/product/${product.slug}`}
                  className="flex flex-1 items-center justify-center rounded-xl bg-black font-semibold text-white transition hover:bg-red-600"
                >
                  Ver producto
                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}