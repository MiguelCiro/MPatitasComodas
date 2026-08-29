"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Search, X } from "lucide-react";

import { Product } from "@/types/product";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({
  open,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error(
            "No se pudieron cargar los productos."
          );
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(
          "Error cargando productos:",
          error
        );

        setProducts([]);
      }
    }

    if (open) {
      loadProducts();
    }
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery) ||
    product.name.toLowerCase().includes(normalizedQuery) ||
    product.category.name.toLowerCase().includes(normalizedQuery)
  );

  return (
    <>
      {/* FONDO OSCURO */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* MODAL */}

      <div
        className={`fixed left-1/2 top-20 z-50 w-[95%] max-w-3xl -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 pointer-events-none opacity-0"
        }`}
      >
        {/* CABECERA */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Buscar productos
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Encuentra tus medias favoritas.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar búsqueda"
            className="transition hover:text-pink-600"
          >
            <X size={30} />
          </button>
        </div>

        {/* BUSCADOR */}

        <div className="relative">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            autoFocus
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Buscar medias, categorías..."
            className="h-14 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none transition focus:border-pink-600"
          />
        </div>

        {/* RESULTADOS */}

        <div className="mt-6 max-h-[420px] overflow-y-auto">
          {normalizedQuery === "" ? (
            <p className="py-10 text-center text-gray-400">
              Busca por nombre o categoría.
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="py-10 text-center text-gray-400">
              No encontramos productos para tu búsqueda.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                >
                  <div className="flex items-center gap-5 rounded-2xl border border-gray-200 p-4 transition hover:border-pink-600 hover:bg-gray-50">
                    {/* IMAGEN */}

                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* INFORMACIÓN */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xl font-bold">
                        {product.name}
                      </p>

                      {/* CATEGORÍA */}

                      <p className="mt-1 text-sm font-medium uppercase tracking-wide text-pink-600">
                        {product.category.name}
                      </p>

                      {/* MARCA */}

                      <p className="mt-1 text-sm text-gray-500">
                        {product.name}
                      </p>

                      {/* PRECIO */}

                      <p className="mt-3 text-2xl font-black">
                        $
                        {product.price.toLocaleString(
                          "es-CO"
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}