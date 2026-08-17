"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Truck,
} from "lucide-react";

import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    subtotal,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    city: "",
    address: "",
    notes: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCheckout() {
    /*
    ==========================================
    VALIDACIONES
    ==========================================
    */

    if (
      !customer.name ||
      !customer.phone ||
      !customer.department ||
      !customer.city ||
      !customer.address
    ) {
      alert(
        "Completa todos los campos obligatorios."
      );

      return;
    }

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");

      return;
    }

    try {
      setLoading(true);

      /*
      ==========================================
      CREAR PEDIDO DE FORMA SEGURA
      ==========================================

      El navegador solamente envía:

      - información del cliente
      - ID del producto
      - talla
      - cantidad

      El servidor obtiene:

      - precio real
      - stock real
      - marca real
      - nombre real
      - subtotal real
      - total real

      directamente desde Supabase.
      */

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
              customer.name,

            customer_email:
              customer.email,

            customer_phone:
              customer.phone,

            department:
              customer.department,

            city:
              customer.city,

            address:
              customer.address,

            notes:
              customer.notes,

            items: cart.map((item) => ({
              product_id: item.id,

              size: item.size,

              quantity: item.quantity,
            })),
          }),
        }
      );

      /*
      ==========================================
      LEER RESPUESTA DEL SERVIDOR
      ==========================================
      */

      const data =
        await response.json();

      /*
      ==========================================
      VERIFICAR RESPUESTA
      ==========================================
      */

      if (!response.ok) {
        throw new Error(
          data.message ||
            "No fue posible crear el pedido."
        );
      }

      /*
      ==========================================
      PEDIDO CREADO
      ==========================================

      El backend ya verificó:

      - productos
      - stock
      - tallas
      - precios
      - subtotal
      - total

      Por lo tanto utilizamos el ID
      generado por Supabase.
      */

      const orderId =
        data.orderId;

      /*
      ==========================================
      LIMPIAR CARRITO
      ==========================================

      Como esta versión es un DEMO y no
      existe una pasarela de pago real,
      el pedido se considera enviado
      correctamente después de guardarlo
      en Supabase.
      */

      clearCart();

      /*
      ==========================================
      REDIRECCIÓN
      ==========================================
      */

      router.push(
        `/checkout/success?id=${orderId}`
      );

    } catch (error) {
      console.error(
        "Error procesando checkout:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo crear el pedido."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-5 py-10">

        {/* ===================================== */}
        {/* VOLVER */}
        {/* ===================================== */}

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-red-600"
        >
          <ArrowLeft size={18} />

          Seguir comprando
        </Link>

        {/* ===================================== */}
        {/* TÍTULO */}
        {/* ===================================== */}

        <h1 className="mb-2 text-5xl font-black">
          Checkout
        </h1>

        <p className="mb-10 text-gray-500">
          Completa tu información para finalizar el pedido.
        </p>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_.7fr]">

          {/* ===================================== */}
          {/* FORMULARIO */}
          {/* ===================================== */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-3">

              <MapPin
                size={26}
                className="text-red-600"
              />

              <h2 className="text-2xl font-black">
                Información del cliente
              </h2>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Nombre */}

              <div>

                <label className="mb-2 block font-semibold">
                  Nombre completo *
                </label>

                <input
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  placeholder="Miguel Ángel Ciro"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
                />

              </div>

              {/* Correo */}

              <div>

                <label className="mb-2 block font-semibold">
                  Correo electrónico
                </label>

                <input
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={handleChange}
                  placeholder="correo@email.com"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
                />

              </div>

              {/* Teléfono */}

              <div>

                <label className="mb-2 block font-semibold">
                  Teléfono *
                </label>

                <input
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  placeholder="3001234567"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
                />

              </div>

              {/* Departamento */}

              <div>

                <label className="mb-2 block font-semibold">
                  Departamento *
                </label>

                <input
                  name="department"
                  value={customer.department}
                  onChange={handleChange}
                  placeholder="Antioquia"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
                />

              </div>

              {/* Ciudad */}

              <div>

                <label className="mb-2 block font-semibold">
                  Ciudad *
                </label>

                <input
                  name="city"
                  value={customer.city}
                  onChange={handleChange}
                  placeholder="Medellín"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
                />

              </div>

              {/* Dirección */}

              <div>

                <label className="mb-2 block font-semibold">
                  Dirección *
                </label>

                <input
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  placeholder="Cra 45 # 50 - 20"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
                />

              </div>

            </div>

            {/* Observaciones */}

            <div className="mt-6">

              <label className="mb-2 block font-semibold">
                Observaciones
              </label>

              <textarea
                rows={5}
                name="notes"
                value={customer.notes}
                onChange={handleChange}
                placeholder="Ej: tocar el timbre, entregar después de las 5 pm..."
                className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
              />

            </div>

          </section>

          {/* ===================================== */}
          {/* RESUMEN */}
          {/* ===================================== */}

          <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm lg:sticky lg:top-8">

            <div className="mb-8 flex items-center gap-3">

              <Truck
                size={26}
                className="text-red-600"
              />

              <h2 className="text-2xl font-black">
                Resumen del pedido
              </h2>

            </div>

            {/* PRODUCTOS */}

            <div className="space-y-5">

              {cart.map((item) => (

                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 border-b pb-5"
                >

                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gray-100">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />

                  </div>

                  <div className="flex flex-1 flex-col">

                    <h3 className="font-bold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.brand.name}
                    </p>

                    <p className="mt-2 text-sm">
                      Talla {item.size}
                    </p>

                    <p className="mt-1 text-sm">
                      Cantidad: {item.quantity}
                    </p>

                    <p className="mt-auto text-lg font-black">
                      $
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString("es-CO")}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="mt-8 rounded-2xl bg-gray-50 p-5">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-bold">
                  $
                  {subtotal.toLocaleString(
                    "es-CO"
                  )}
                </span>

              </div>

              <div className="mt-3 flex justify-between">

                <span className="text-gray-500">
                  Envío
                </span>

                <span className="font-bold text-green-600">
                  Gratis
                </span>

              </div>

              <div className="my-5 border-t"></div>

              <div className="flex justify-between">

                <span className="text-xl font-bold">
                  Total
                </span>

                <span className="text-3xl font-black">
                  $
                  {subtotal.toLocaleString(
                    "es-CO"
                  )}
                </span>

              </div>

            </div>

            {/* ===================================== */}
            {/* PEDIDO DEMO */}
            {/* ===================================== */}

            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">

              <div className="flex items-center gap-3">

                <CreditCard
                  size={22}
                  className="text-blue-600"
                />

                <div>

                  <p className="font-bold text-blue-700">
                    Pedido de demostración
                  </p>

                  <p className="text-sm text-blue-600">
                    Este checkout simula el proceso de compra. No se realiza ningún cobro.
                  </p>

                </div>

              </div>

            </div>

            {/* ===================================== */}
            {/* BOTÓN */}
            {/* ===================================== */}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-black py-4 text-lg font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >

              <CreditCard size={22} />

              {loading
                ? "Procesando pedido..."
                : "Confirmar pedido"}

            </button>

          </aside>

        </div>

      </div>

    </main>
  );
}