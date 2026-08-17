"use client";

import { X } from "lucide-react";

import { Product } from "@/types/product";

import ProductGallery from "@/components/ProductGallery/ProductGallery";
import ProductDetail from "@/components/ProductDetail/ProductDetail";

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export default function ProductDrawer({
  product,
  open,
  onClose,
}: Props) {

  if (!product) return null;

  return (
    <>
      {/* Fondo oscuro */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-all duration-300 ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed inset-0 z-50 bg-white transition-transform duration-500 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* Botón cerrar */}

        <button
          onClick={onClose}
          className="absolute right-8 top-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
        >
          <X size={28} />
        </button>

        <div className="grid h-screen lg:grid-cols-2 grid-cols-1 overflow-y-auto">
          {/* Imagen */}

          <ProductGallery
            image={product.image}
            name={product.name}
          />

          {/* Información */}

          <ProductDetail
            product={product}
            onClose={onClose}
          />

        </div>

      </aside>
    </>
  );
}