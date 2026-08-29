"use client";

import Image from "next/image";
import { useContext, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";

import Container from "@/components/Container/Container";
import ColorSelector from "@/components/ColorSelector/ColorSelector";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

import { CartContext } from "@/context/CartContext";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

type ColorImage = {
  color: string;
  image: string;
};

function normalizeColor(color: string) {
  return color
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getColorImages(
  value: unknown
): ColorImage[] {
  // ==========================================
  // FORMATO ACTUAL DE SUPABASE
  // [
  //   { color: "Negro", image: "..." },
  //   { color: "Blanco", image: "..." }
  // ]
  // ==========================================

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is ColorImage =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ColorImage).color ===
          "string" &&
        typeof (item as ColorImage).image ===
          "string"
    );
  }

  // ==========================================
  // COMPATIBILIDAD CON FORMATO ANTIGUO
  //
  // {
  //   "Negro": "...",
  //   "Blanco": "..."
  // }
  // ==========================================

  if (
    typeof value === "object" &&
    value !== null
  ) {
    return Object.entries(
      value as Record<string, unknown>
    )
      .filter(
        ([, image]) =>
          typeof image === "string"
      )
      .map(([color, image]) => ({
        color,
        image: image as string,
      }));
  }

  // ==========================================
  // SI VIENE COMO STRING JSON
  // ==========================================

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      return getColorImages(parsed);
    } catch {
      return [];
    }
  }

  return [];
}

export default function ProductPageClient({
  product,
}: Props) {
  const { addToCart } =
    useContext(CartContext);

  // ==========================================
  // COLORES
  // ==========================================

  const colors = product.colors ?? [];

  const colorImages = useMemo(
    () =>
      getColorImages(
        product.color_images
      ),
    [product.color_images]
  );

  // ==========================================
  // COLOR SELECCIONADO
  // ==========================================

  const [selectedColor, setSelectedColor] =
    useState<string | null>(
      colors[0] ?? null
    );

  // ==========================================
  // CANTIDAD
  // ==========================================

  const [quantity, setQuantity] =
    useState(1);

  // ==========================================
  // IMAGEN DEL COLOR
  // ==========================================

  const selectedImage = useMemo(() => {
    // Si no hay color seleccionado,
    // mostramos la imagen principal.
    if (!selectedColor) {
      return product.image;
    }

    const normalizedSelectedColor =
      normalizeColor(selectedColor);

    const matchedImage =
      colorImages.find(
        (item) =>
          normalizeColor(item.color) ===
          normalizedSelectedColor
      );

    // ========================================
    // DEBUG
    // ========================================

    console.log(
      "COLOR SELECCIONADO:",
      selectedColor
    );

    console.log(
      "IMÁGENES POR COLOR:",
      colorImages
    );

    console.log(
      "IMAGEN ENCONTRADA:",
      matchedImage?.image
    );

    // ========================================
    // DEVOLVER IMAGEN
    // ========================================

    return (
      matchedImage?.image ??
      product.image
    );
  }, [
    selectedColor,
    colorImages,
    product.image,
  ]);

  // ==========================================
  // AUMENTAR CANTIDAD
  // ==========================================

  function increaseQuantity() {
    if (quantity >= product.stock) {
      return;
    }

    setQuantity(
      (current) => current + 1
    );
  }

  // ==========================================
  // DISMINUIR CANTIDAD
  // ==========================================

  function decreaseQuantity() {
    if (quantity <= 1) {
      return;
    }

    setQuantity(
      (current) => current - 1
    );
  }

  // ==========================================
  // CAMBIAR COLOR
  // ==========================================

  function handleColorChange(
    color: string
  ) {
    console.log(
      "CAMBIANDO COLOR A:",
      color
    );

    setSelectedColor(color);
  }

  // ==========================================
  // AGREGAR AL CARRITO
  // ==========================================

  function handleAddToCart() {
    if (!selectedColor) {
      alert(
        "Selecciona un color."
      );

      return;
    }

    if (product.stock <= 0) {
      return;
    }

    if (quantity < 1) {
      return;
    }

    // ========================================
    // IMPORTANTE:
    //
    // Guardamos en el producto del carrito
    // la imagen correspondiente al color.
    // ========================================

    const productForCart: Product = {
      ...product,
      image: selectedImage,
    };

    addToCart(
      productForCart,
      selectedColor,
      quantity
    );
  }

  return (
    <Container>
      <section className="grid gap-10 py-10 md:gap-16 md:py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">

        {/* ================================= */}
        {/* IMAGEN DEL PRODUCTO */}
        {/* ================================= */}

        <div className="rounded-3xl bg-gray-100 p-5 md:p-10">

          <Image
            key={`${product.id}-${selectedColor}-${selectedImage}`}
            src={selectedImage}
            alt={`${product.name} ${
              selectedColor ?? ""
            }`}
            width={700}
            height={700}
            priority
            unoptimized
            className="mx-auto h-auto w-full object-contain"
          />

        </div>

        {/* ================================= */}
        {/* INFORMACIÓN */}
        {/* ================================= */}

        <div className="flex flex-col">

          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-base leading-7 text-gray-600 md:text-lg">
            {product.description}
          </p>

          <p className="mt-6 text-3xl font-black md:text-4xl">
            $
            {product.price.toLocaleString(
              "es-CO"
            )}
          </p>

          {/* ================================= */}
          {/* COLORES */}
          {/* ================================= */}

          {colors.length > 0 ? (
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onSelect={handleColorChange}
            />
          ) : (
            <div className="mt-6 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
              Este producto no tiene colores
              disponibles.
            </div>
          )}

          {/* ================================= */}
          {/* CANTIDAD */}
          {/* ================================= */}

          <QuantitySelector
            quantity={quantity}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
          />

          {/* ================================= */}
          {/* STOCK */}
          {/* ================================= */}

          <p
            className={`mt-8 font-bold ${
              product.stock > 0
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `Stock disponible: ${product.stock}`
              : "Producto agotado"}
          </p>

          {/* ================================= */}
          {/* CARRITO */}
          {/* ================================= */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              product.stock <= 0
            }
            className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 text-lg font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingBag size={22} />

            {product.stock <= 0
              ? "Agotado"
              : "Agregar al carrito"}
          </button>

        </div>

      </section>
    </Container>
  );
}