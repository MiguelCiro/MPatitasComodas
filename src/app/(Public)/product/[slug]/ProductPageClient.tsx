"use client";

import Image from "next/image";
import { useContext, useState } from "react";
import { ShoppingBag } from "lucide-react";

import Container from "@/components/Container/Container";

import SizeSelector from "@/components/SizeSelector/SizeSelector";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

import { CartContext } from "@/context/CartContext";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductPageClient({
  product,
}: Props) {
  const {
    addToCart,
  } = useContext(CartContext);

  const [selectedSize, setSelectedSize] =
    useState<number | null>(null);

  const [quantity, setQuantity] =
    useState(1);

  function increaseQuantity() {
    if (
      quantity >= product.stock
    ) {
      return;
    }

    setQuantity((current) =>
      current + 1
    );
  }

  function decreaseQuantity() {
    if (quantity <= 1) {
      return;
    }

    setQuantity((current) =>
      current - 1
    );
  }

  function handleAddToCart() {
    if (!selectedSize) {
      alert("Selecciona una talla.");
      return;
    }

    addToCart(
      product,
      selectedSize,
      quantity
    );
  }

  return (
    <Container>

      <section className="grid gap-10 py-10 md:gap-16 md:py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">

        {/* ============================== */}
        {/* IMAGEN */}
        {/* ============================== */}

        <div className="rounded-3xl bg-gray-100 p-5 md:p-10">

          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={700}
            priority
            className="mx-auto h-auto w-full object-contain"
          />

        </div>

        {/* ============================== */}
        {/* INFORMACIÓN */}
        {/* ============================== */}

        <div className="flex flex-col">

          {/* Marca */}

          <p className="font-semibold uppercase tracking-wide text-red-600">

            {product.brand.name}

          </p>

          {/* Nombre */}

          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">

            {product.name}

          </h1>

          {/* Descripción */}

          <p className="mt-5 text-base leading-7 text-gray-600 md:text-lg">

            {product.description}

          </p>

          {/* Precio */}

          <p className="mt-6 text-3xl font-black md:text-4xl">

            ${product.price.toLocaleString(
              "es-CO"
            )}

          </p>

          {/* Stock */}

          <p className="mt-3 text-sm text-gray-500">

            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Producto agotado"}

          </p>

          {/* ============================== */}
          {/* TALLAS */}
          {/* ============================== */}

          <SizeSelector
            sizes={product.sizes ?? []}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
          />

          {/* ============================== */}
          {/* CANTIDAD */}
          {/* ============================== */}

          <QuantitySelector
            quantity={quantity}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
          />

          {/* ============================== */}
          {/* CARRITO */}
          {/* ============================== */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 text-lg font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >

            <ShoppingBag size={22} />

            {product.stock <= 0
              ? "Agotado"
              : "Añadir al carrito"}

          </button>

        </div>

      </section>

    </Container>
  );
}