"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Product } from "@/types/product";
import { CartContext } from "@/context/CartContext";

import ProductInfo from "@/components/ProductInfo/ProductInfo";
import ColorSelector from "@/components/ColorSelector/ColorSelector";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

type Props = {
  product: Product;
  onClose: () => void;
  onImageChange?: (image: string) => void;
};

type ColorImage = {
  color: string;
  image: string;
};

// ==========================================
// Normalizar colores
// ==========================================

function normalizeColor(color: string) {
  return color
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ==========================================
// Convertir color_images a array
// ==========================================

function getColorImages(
  value: unknown
): ColorImage[] {
  // ----------------------------------------
  // Formato actual:
  //
  // [
  //   {
  //     color: "Negro",
  //     image: "..."
  //   }
  // ]
  // ----------------------------------------

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is ColorImage =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ColorImage)
          .color === "string" &&
        typeof (item as ColorImage)
          .image === "string"
    );
  }

  // ----------------------------------------
  // Formato antiguo:
  //
  // {
  //   Negro: "...",
  //   Blanco: "..."
  // }
  // ----------------------------------------

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

  // ----------------------------------------
  // Si Supabase devuelve JSON como string
  // ----------------------------------------

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

export default function ProductDetail({
  product,
  onClose,
  onImageChange,
}: Props) {
  const { addToCart } =
    useContext(CartContext);

  // ==========================================
  // COLORES
  // ==========================================

  const colors = product.colors ?? [];

  // ==========================================
  // IMÁGENES POR COLOR
  // ==========================================

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
  // IMAGEN SELECCIONADA
  // ==========================================

  const selectedImage = useMemo(() => {
    if (!selectedColor) {
      return product.image;
    }

    const found =
      colorImages.find(
        (item) =>
          normalizeColor(item.color) ===
          normalizeColor(
            selectedColor
          )
      );

    return (
      found?.image ??
      product.image
    );
  }, [
    selectedColor,
    colorImages,
    product.image,
  ]);

  // ==========================================
  // AVISAR AL DRAWER CUANDO CAMBIA IMAGEN
  // ==========================================

  useEffect(() => {
    onImageChange?.(selectedImage);
  }, [
    selectedImage,
    onImageChange,
  ]);

  // ==========================================
  // CUANDO CAMBIA EL PRODUCTO
  // ==========================================

  useEffect(() => {
    setSelectedColor(
      colors[0] ?? null
    );

    setQuantity(1);
  }, [product.id]);

  // ==========================================
  // CAMBIAR COLOR
  // ==========================================

  function handleColorChange(
    color: string
  ) {
    setSelectedColor(color);
  }

  // ==========================================
  // AUMENTAR
  // ==========================================

  function increaseQuantity() {
    if (
      quantity >= product.stock
    ) {
      return;
    }

    setQuantity(
      (current) => current + 1
    );
  }

  // ==========================================
  // DISMINUIR
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
    // Creamos una copia del producto
    // usando la imagen del color elegido.
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

    onClose();
  }

  return (
    <div className="flex w-full flex-col justify-center px-6 py-8 sm:px-10 lg:px-16 lg:py-14">

      {/* ==================================== */}
      {/* INFORMACIÓN */}
      {/* ==================================== */}

      <ProductInfo
        name={product.name}
        description={product.description}
        price={product.price}
      />

      {/* ==================================== */}
      {/* COLORES */}
      {/* ==================================== */}

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

      {/* ==================================== */}
      {/* CANTIDAD */}
      {/* ==================================== */}

      <QuantitySelector
        quantity={quantity}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
      />

      {/* ==================================== */}
      {/* STOCK */}
      {/* ==================================== */}

      <div className="mt-8">
        <p
          className={`text-lg font-semibold ${
            product.stock > 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {product.stock > 0
            ? `Stock disponible: ${product.stock}`
            : "Producto agotado"}
        </p>
      </div>

      {/* ==================================== */}
      {/* CARRITO */}
      {/* ==================================== */}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={
          product.stock <= 0
        }
        className="mt-12 h-16 w-full rounded-xl bg-black text-lg font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {product.stock <= 0
          ? "Agotado"
          : "Agregar al carrito"}
      </button>

    </div>
  );
}