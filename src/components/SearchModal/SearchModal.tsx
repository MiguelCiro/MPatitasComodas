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

      const response = await fetch("/api/products");

      const data = await response.json();

      setProducts(data);

    }

    if (open) {

      loadProducts();

    }

  }, [open]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      <div
        className={`fixed left-1/2 top-20 z-50 w-[95%] max-w-3xl -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 pointer-events-none opacity-0"
        }`}
      >

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-black">
            Buscar productos
          </h2>

          <button onClick={onClose}>
            <X size={30} />
          </button>

        </div>

        <div className="relative">

          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar sneakers..."
            className="h-14 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none focus:border-black"
          />

        </div>

        <div className="mt-6 max-h-[420px] overflow-y-auto">

          {query === "" ? (

            <p className="py-10 text-center text-gray-400">
              Escribe para comenzar la búsqueda.
            </p>

          ) : filteredProducts.length === 0 ? (

            <p className="py-10 text-center text-gray-400">
              No encontramos resultados.
            </p>

          ) : (

            <div className="space-y-3">

              {filteredProducts.map((product) => (

                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                >

                  <div className="flex items-center gap-5 rounded-2xl border border-gray-200 p-4 transition hover:border-black hover:bg-gray-50">

                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-gray-100">

                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />

                    </div>

                    <div className="flex-1">

                      <p className="text-xl font-bold">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm uppercase tracking-wide text-red-600">
                        {product.brand.name}
                      </p>

                      <p className="mt-3 text-2xl font-black">
                        ${product.price.toLocaleString("es-CO")}
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