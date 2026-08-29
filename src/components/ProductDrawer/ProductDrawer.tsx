"use client";

import { useEffect, useState } from "react";
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
  const [selectedImage, setSelectedImage] =
    useState<string>("");

  // ==========================================
  // Cuando cambia el producto
  // volvemos a su imagen principal
  // ==========================================

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!product) return null;

  return (
    <>
      {/* ====================================== */}
      {/* FONDO OSCURO */}
      {/* ====================================== */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-all duration-300 ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ====================================== */}
      {/* DRAWER */}
      {/* ====================================== */}

      <aside
        className={`fixed inset-0 z-50 bg-white transition-transform duration-500 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* ==================================== */}
        {/* CERRAR */}
        {/* ==================================== */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-8 top-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
          aria-label="Cerrar producto"
        >
          <X size={28} />
        </button>

        {/* ==================================== */}
        {/* CONTENIDO */}
        {/* ==================================== */}

        <div className="grid h-screen grid-cols-1 overflow-y-auto lg:grid-cols-2">

          {/* ================================== */}
          {/* GALERÍA */}
          {/* ================================== */}

          <ProductGallery
            image={
              selectedImage ||
              product.image
            }
            name={product.name}
          />

          {/* ================================== */}
          {/* INFORMACIÓN */}
          {/* ================================== */}

          <ProductDetail
            product={product}
            onClose={onClose}
            onImageChange={setSelectedImage}
          />

        </div>
      </aside>
    </>
  );
}