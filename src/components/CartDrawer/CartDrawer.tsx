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
      {/* =========================================
          OVERLAY
      ========================================= */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-all duration-300 ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* =========================================
          DRAWER
      ========================================= */}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-[430px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex items-center justify-between border-b px-5 py-6 sm:px-8 sm:py-7">

          <h2 className="text-2xl font-black sm:text-3xl">
            Carrito ({totalItems})
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 transition hover:rotate-90"
            aria-label="Cerrar carrito"
          >
            <X size={28} />
          </button>

        </div>

        {/* =====================================
            PRODUCTOS
        ===================================== */}

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

          {/* CARRITO VACÍO */}

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

          {/* PRODUCTOS */}

          {cart.map((item) => (
            <div
              key={`${item.id}-${item.color}`}
              className="
                mb-5
                flex
                gap-3
                rounded-2xl
                border
                p-3
                sm:gap-4
              "
            >

              {/* ================================
                  IMAGEN
              ================================= */}

              <div
                className="
                  relative
                  h-24
                  w-24
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  bg-gray-100
                  sm:h-28
                  sm:w-28
                "
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* ================================
                  INFORMACIÓN
              ================================= */}

              <div className="flex min-w-0 flex-1 flex-col">

                {/* NOMBRE + ELIMINAR */}

                <div className="flex min-w-0 justify-between gap-2">

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-sm font-bold sm:text-base">
                      {item.name}
                    </h3>

                    <p className="mt-1 break-words text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm">
                      {item.name} · Color: {item.color}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.color
                      )
                    }
                    className="shrink-0 self-start"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2
                      size={18}
                      className="text-red-500"
                    />
                  </button>

                </div>

                {/* ================================
                    CANTIDAD + PRECIO
                ================================= */}

                <div
                  className="
                    mt-4
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  {/* CANTIDAD */}

                  <div className="flex shrink-0 items-center rounded-xl border">

                    <button
                      type="button"
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

                    <span className="min-w-8 px-2 text-center font-bold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
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

                  {/* PRECIO */}

                  <p
                    className="
                      min-w-0
                      shrink
                      text-right
                      text-base
                      font-black
                      leading-tight
                      sm:text-lg
                    "
                  >
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

        {/* =========================================
            FOOTER DEL CARRITO
        ========================================= */}

        <div className="border-t px-5 py-6 sm:px-8 sm:py-8">

          <div className="py-2">

            {/* SUBTOTAL */}

            <div className="flex items-center justify-between gap-4 text-sm text-gray-500">

              <span>
                Subtotal
              </span>

              <span className="shrink-0 font-semibold text-gray-800">
                ${subtotal.toLocaleString("es-CO")}
              </span>

            </div>

            {/* ENVÍO */}

            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-gray-500">

              <span>
                Envío
              </span>

              <span className="shrink-0 font-semibold text-green-600">
                Gratis
              </span>

            </div>

            <hr className="my-6" />

            {/* TOTAL */}

            <div className="flex items-center justify-between gap-4">

              <span className="text-lg font-bold">
                Total
              </span>

              <span className="shrink-0 text-2xl font-black sm:text-3xl">
                ${subtotal.toLocaleString("es-CO")}
              </span>

            </div>

          </div>

          {/* FINALIZAR */}

          <button
            type="button"
            onClick={() =>
              setOpenCheckout(true)
            }
            disabled={cart.length === 0}
            className="
              mt-7
              w-full
              rounded-2xl
              bg-black
              py-4
              text-lg
              font-bold
              text-white
              transition
              hover:bg-red-600
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Finalizar compra
          </button>

          {/* VACIAR */}

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="
                mt-4
                w-full
                text-sm
                font-semibold
                text-gray-500
                transition
                hover:text-black
              "
            >
              Vaciar carrito
            </button>
          )}

        </div>

      </aside>

      {/* CHECKOUT */}

      <CheckoutDrawer
        open={openCheckout}
        onClose={() =>
          setOpenCheckout(false)
        }
      />

    </>
  );
}