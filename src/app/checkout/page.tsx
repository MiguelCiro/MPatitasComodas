"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";

import { useCart } from "@/hooks/useCart";

type PaymentMethod =
  | "transfer"
  | "cash_on_delivery";

export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] =
    useState("");

  const [customerEmail, setCustomerEmail] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [city, setCity] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const shipping = 0;

  const total =
    subtotal + shipping;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError(
        "Tu carrito está vacío."
      );
      return;
    }

    if (!paymentMethod) {
      setError(
        "Selecciona un método de pago."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customer_name:
              customerName.trim(),

            customer_email:
              customerEmail.trim(),

            customer_phone:
              customerPhone.trim(),

            department:
              department.trim(),

            city:
              city.trim(),

            address:
              address.trim(),

            notes:
              notes.trim(),

            payment_method:
              paymentMethod,

            items: cart.map(
              (item) => ({
                product_id:
                  item.id,

                color:
                  item.color,

                quantity:
                  item.quantity,
              })
            ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "No fue posible crear el pedido."
        );
      }

      clearCart();

      window.location.href =
        `/checkout/success?id=${data.orderId}&payment=${paymentMethod}`;
    } catch (error) {
      console.error(
        "Error creando pedido:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear el pedido."
      );
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-5 py-16 sm:px-6">

        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">

            <Package
              size={38}
              className="text-gray-400"
            />

          </div>

          <h1 className="mt-7 text-3xl font-black sm:text-4xl">
            Tu carrito está vacío
          </h1>

          <p className="mx-auto mt-4 max-w-md leading-7 text-gray-500">
            Agrega algunos productos antes de
            continuar con tu compra.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-7 py-4 font-bold text-white transition hover:bg-red-600"
          >

            <ArrowLeft size={20} />

            Volver a la tienda

          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">

      <div className="mx-auto max-w-7xl px-5 sm:px-6">

        {/* VOLVER */}

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-gray-600 transition hover:text-red-600"
        >

          <ArrowLeft size={20} />

          Seguir comprando

        </Link>

        {/* ENCABEZADO */}

        <div className="mb-10">

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Finalizar compra
          </h1>

          <p className="mt-3 text-gray-500">
            Completa tus datos para realizar
            tu pedido.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]"
        >

          {/* ================================= */}
          {/* COLUMNA IZQUIERDA */}
          {/* ================================= */}

          <div className="space-y-8">

            {/* DATOS PERSONALES */}

            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <h2 className="text-2xl font-black">
                Información personal
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <label className="mb-2 block font-semibold">
                    Nombre completo *
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(
                        event.target.value
                      )
                    }
                    required
                    placeholder="Tu nombre completo"
                    className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-red-600"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-semibold">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) =>
                      setCustomerEmail(
                        event.target.value
                      )
                    }
                    placeholder="correo@ejemplo.com"
                    className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-red-600"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-semibold">
                    Teléfono *
                  </label>

                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) =>
                      setCustomerPhone(
                        event.target.value
                      )
                    }
                    required
                    placeholder="300 000 0000"
                    className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-red-600"
                  />

                </div>

              </div>

            </section>

            {/* DIRECCIÓN */}

            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">

                  <MapPin size={22} />

                </div>

                <h2 className="text-2xl font-black">
                  Dirección de entrega
                </h2>

              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block font-semibold">
                    Departamento *
                  </label>

                  <input
                    type="text"
                    value={department}
                    onChange={(event) =>
                      setDepartment(
                        event.target.value
                      )
                    }
                    required
                    placeholder="Antioquia"
                    className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-red-600"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-semibold">
                    Ciudad *
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                    required
                    placeholder="Medellín"
                    className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-red-600"
                  />

                </div>

                <div className="sm:col-span-2">

                  <label className="mb-2 block font-semibold">
                    Dirección *
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    required
                    placeholder="Calle, carrera, número, apartamento..."
                    className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-red-600"
                  />

                </div>

                <div className="sm:col-span-2">

                  <label className="mb-2 block font-semibold">
                    Indicaciones adicionales
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Ejemplo: apartamento 302, portería..."
                    className="w-full resize-none rounded-xl border border-gray-200 p-4 outline-none transition focus:border-red-600"
                  />

                </div>

              </div>

            </section>

            {/* MÉTODO DE PAGO */}

            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <h2 className="text-2xl font-black">
                Método de pago
              </h2>

              <p className="mt-2 text-gray-500">
                Selecciona cómo deseas pagar
                tu pedido.
              </p>

              <div className="mt-7 grid gap-4">

                {/* TRANSFERENCIA */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "transfer"
                    )
                  }
                  className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition ${
                    paymentMethod ===
                    "transfer"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >

                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    paymentMethod ===
                    "transfer"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>

                    <CreditCard size={23} />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="font-bold">
                        Transferencia
                      </span>

                      {paymentMethod ===
                        "transfer" && (
                        <CheckCircle2
                          size={19}
                          className="text-red-600"
                        />
                      )}

                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Realiza una transferencia y
                      te contactaremos para confirmar
                      la información del pago y tu
                      pedido.
                    </p>

                  </div>

                </button>

                {/* CONTRAENTREGA */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "cash_on_delivery"
                    )
                  }
                  className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition ${
                    paymentMethod ===
                    "cash_on_delivery"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >

                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    paymentMethod ===
                    "cash_on_delivery"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>

                    <Banknote size={23} />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="font-bold">
                        Pago contraentrega
                      </span>

                      {paymentMethod ===
                        "cash_on_delivery" && (
                        <CheckCircle2
                          size={19}
                          className="text-red-600"
                        />
                      )}

                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Paga tu pedido al momento de
                      recibirlo. La disponibilidad
                      será confirmada antes del envío.
                    </p>

                  </div>

                </button>

              </div>

              <Link
                href="/pagos"
                className="mt-5 inline-block text-sm font-semibold text-red-600 transition hover:text-red-700"
              >
                Ver más información sobre los métodos de pago
              </Link>

            </section>

          </div>

          {/* ================================= */}
          {/* RESUMEN */}
          {/* ================================= */}

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-6">

            <h2 className="text-2xl font-black">
              Tu pedido
            </h2>

            <div className="mt-7 space-y-5">

              {cart.map((item) => (

                <div
                  key={`${item.id}-${item.color}`}
                  className="flex gap-4 border-b border-gray-100 pb-5"
                >

                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex gap-3">

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate font-bold">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Color: {item.color}
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
                        className="shrink-0 text-gray-400 transition hover:text-red-600"
                        aria-label={`Eliminar ${item.name}`}
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">

                      <div className="flex items-center rounded-lg border">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.color
                            )
                          }
                          className="p-2"
                        >

                          <Minus size={15} />

                        </button>

                        <span className="min-w-9 text-center text-sm font-bold">
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
                        >

                          <Plus size={15} />

                        </button>

                      </div>

                      <p className="font-black">

                        $
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString(
                          "es-CO"
                        )}

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            <div className="mt-7 space-y-4">

              <div className="flex justify-between text-gray-500">

                <span>Subtotal</span>

                <span>
                  ${subtotal.toLocaleString("es-CO")}
                </span>

              </div>

              <div className="flex justify-between text-gray-500">

                <span className="flex items-center gap-2">

                  <Truck size={17} />

                  Envío

                </span>

                <span className="font-semibold text-green-600">
                  Gratis
                </span>

              </div>

              <div className="border-t pt-5">

                <div className="flex items-center justify-between">

                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-3xl font-black">
                    ${total.toLocaleString("es-CO")}
                  </span>

                </div>

              </div>

            </div>

            {error && (

              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>

            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex h-15 w-full items-center justify-center gap-3 rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>

                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Procesando pedido...

                </>
              ) : (
                "Confirmar pedido"
              )}

            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Al confirmar tu pedido aceptas
              nuestros términos y condiciones y
              nuestra política de privacidad.
            </p>

          </aside>

        </form>

      </div>

    </main>
  );
}