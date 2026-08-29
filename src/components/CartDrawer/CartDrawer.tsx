"use client";

import { useState } from "react";

import Image from "next/image";

import CheckoutDrawer from "@/components/CheckoutDrawer/CheckoutDrawer";

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "@/hooks/useCart";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({
  open,
  onClose,
}: Props) {
  const {
    cart,
    totalItems,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [openCheckout, setOpenCheckout] =
    useState(false);

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-all duration-300 ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-[430px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-7">
          <h2 className="text-3xl font-black">
            Carrito ({totalItems})
          </h2>

          <button
            onClick={onClose}
            className="transition hover:rotate-90"
            aria-label="Cerrar carrito"
          >
            <X size={28} />
          </button>
        </div>

        {/* Productos */}

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 && (
            <div className="mt-32 text-center">
              <ShoppingBag
                size={82}
                className="mx-auto text-gray-300"
              />

              <p className="mt-8 text-xl font-semibold text-gray-500">
                Tu carrito está vacío.
              </p>
            </div>
          )}

          {cart.map((item) => (
            <div
              key={`${item.id}-${item.color}`}
              className="mb-6 flex gap-4 rounded-2xl border p-3"
            >
              {/* Imagen */}

              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.name} · Color: {item.color}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.color
                      )
                    }
                    className="shrink-0"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2
                      size={18}
                      className="text-red-500"
                    />
                  </button>
                </div>

                {/* Cantidad y precio */}

                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-xl border">
                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.color
                        )
                      }
                      className="p-2"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-4 font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.color
                        )
                      }
                      className="p-2"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="text-lg font-black">
                    $
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="border-t px-8 py-8">
          <div className="py-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>

              <span className="font-semibold text-gray-800">
                ${subtotal.toLocaleString("es-CO")}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>Envío</span>

              <span className="font-semibold text-green-600">
                Gratis
              </span>
            </div>

            <hr className="my-6" />

            <div className="flex justify-between">
              <span className="text-lg font-bold">
                Total
              </span>

              <span className="text-2xl font-black">
                ${subtotal.toLocaleString("es-CO")}
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpenCheckout(true)}
            disabled={cart.length === 0}
            className="mt-8 w-full rounded-2xl bg-black py-4 text-lg font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finalizar compra
          </button>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-4 w-full text-sm font-semibold text-gray-500 transition hover:text-black"
            >
              Vaciar carrito
            </button>
          )}
        </div>
      </aside>

      <CheckoutDrawer
        open={openCheckout}
        onClose={() => setOpenCheckout(false)}
      />
    </>
  );
}