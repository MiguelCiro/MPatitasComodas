"use client";

import { useContext, useEffect, useState } from "react";

import { Product } from "@/types/product";
import { CartContext } from "@/context/CartContext";

import ProductInfo from "@/components/ProductInfo/ProductInfo";
import SizeSelector from "@/components/SizeSelector/SizeSelector";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

type Props = {
  product: Product;
  onClose: () => void;
};

export default function ProductDetail({
  product,
  onClose,
}: Props) {
  const { addToCart } = useContext(CartContext);

  const [selectedSize, setSelectedSize] =
    useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  /*
   * Algunos productos pueden venir desde Supabase
   * con sizes = null.
   *
   * Convertimos null en un array vacío para evitar
   * errores como:
   *
   * Cannot read properties of null (reading '0')
   */
  const sizes = product.sizes ?? [];

  useEffect(() => {
    if (sizes.length > 0) {
      setSelectedSize(sizes[0]);
    } else {
      setSelectedSize(null);
    }

    setQuantity(1);
  }, [product]);

  function handleAddToCart() {
    /*
     * Para agregar un producto al carrito necesitamos
     * tener una talla seleccionada.
     */
    if (selectedSize === null) {
      alert("Selecciona una talla.");
      return;
    }

    /*
     * Agregamos la cantidad seleccionada al carrito.
     */
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }

    onClose();
  }

  return (
    <div className="flex w-full flex-col justify-center px-6 py-8 sm:px-10 lg:px-16 lg:py-14">

      {/* Información del producto */}
      <ProductInfo
        brand={product.brand.name}
        name={product.name}
        description={product.description}
        price={product.price}
      />

      {/* Selector de tallas */}
      {sizes.length > 0 ? (
        <SizeSelector
          sizes={sizes}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />
      ) : (
        <div className="mt-6 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
          Este producto no tiene tallas disponibles.
        </div>
      )}

      {/* Selector de cantidad */}
      <QuantitySelector
        quantity={quantity}
        onIncrease={() =>
          setQuantity(quantity + 1)
        }
        onDecrease={() =>
          quantity > 1 &&
          setQuantity(quantity - 1)
        }
      />

      {/* Stock */}
      <div className="mt-8">
        <p className="text-lg font-semibold text-green-600">
          Stock disponible: {product.stock}
        </p>
      </div>

      {/* Agregar al carrito */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-12 h-16 w-full rounded-xl bg-black text-lg font-bold text-white transition hover:bg-red-600"
      >
        Agregar al carrito
      </button>

    </div>
  );
}