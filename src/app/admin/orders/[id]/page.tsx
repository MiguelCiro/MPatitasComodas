"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Package,
} from "lucide-react";

import {
  getOrder,
  updateOrderStatus,
} from "@/services/order.service";

export default function OrderDetailPage() {
  const params = useParams();

  const id = Number(params.id);

  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // CARGAR PEDIDO
  // ==========================================

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrder(id);

        if (!data) {
          setOrder(null);
          return;
        }

        setOrder(data);
        setStatus(data.status ?? "pending");
      } catch (error) {
        console.error(
          "Error cargando pedido:",
          error
        );

        setError(
          "No fue posible cargar el pedido."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [id]);

  // ==========================================
  // ACTUALIZAR ESTADO
  // ==========================================

  async function handleSaveStatus() {
    if (!order || saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedOrder =
        await updateOrderStatus(
          order.id,
          status
        );

      setOrder((currentOrder: any) => ({
        ...currentOrder,
        ...(updatedOrder ?? {}),
        status,
      }));

      alert(
        "Estado actualizado correctamente."
      );
    } catch (error) {
      console.error(
        "Error actualizando estado:",
        error
      );

      setError(
        "No fue posible actualizar el estado del pedido."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-xl font-semibold">
          Cargando pedido...
        </p>
      </div>
    );
  }

  // ==========================================
  // PEDIDO NO ENCONTRADO
  // ==========================================

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">
            Pedido no encontrado.
          </p>

          <Link
            href="/admin/orders"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-red-600 hover:underline"
          >
            <ArrowLeft size={18} />
            Volver a pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">

      {/* ==========================================
          VOLVER
      ========================================== */}

      <Link
        href="/admin/orders"
        className="mb-8 inline-flex items-center gap-2 font-semibold transition hover:text-red-600"
      >
        <ArrowLeft size={18} />

        Volver a pedidos
      </Link>

      {/* ==========================================
          HEADER
      ========================================== */}

      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
        Pedido #{order.id}
      </h1>

      <p className="mt-2 text-gray-500">
        Información completa del pedido.
      </p>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* ==========================================
          CONTENIDO
      ========================================== */}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.8fr]">

        {/* ==========================================
            COLUMNA IZQUIERDA
        ========================================== */}

        <div className="space-y-8">

          {/* ======================================
              CLIENTE
          ====================================== */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 flex items-center gap-3 text-2xl font-black">

              <Package
                size={26}
                className="text-red-600"
              />

              Información del cliente

            </h2>

            <div className="space-y-5">

              {/* NOMBRE */}

              <div>

                <p className="text-sm text-gray-500">
                  Nombre
                </p>

                <p className="text-lg font-bold">
                  {order.customer_name ||
                    "No especificado"}
                </p>

              </div>

              {/* EMAIL */}

              <div className="flex items-center gap-3">

                <Mail
                  size={18}
                  className="text-gray-500"
                />

                <span>
                  {order.customer_email ||
                    "No especificado"}
                </span>

              </div>

              {/* TELÉFONO */}

              <div className="flex items-center gap-3">

                <Phone
                  size={18}
                  className="text-gray-500"
                />

                <span>
                  {order.customer_phone ||
                    "No especificado"}
                </span>

              </div>

            </div>

          </section>

          {/* ======================================
              DIRECCIÓN
          ====================================== */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 flex items-center gap-3 text-2xl font-black">

              <MapPin
                size={26}
                className="text-red-600"
              />

              Dirección de entrega

            </h2>

            <div className="space-y-4">

              {/* DEPARTAMENTO */}

              <div>

                <p className="text-sm text-gray-500">
                  Departamento
                </p>

                <p className="font-semibold">
                  {order.department ||
                    "No especificado"}
                </p>

              </div>

              {/* CIUDAD */}

              <div>

                <p className="text-sm text-gray-500">
                  Ciudad
                </p>

                <p className="font-semibold">
                  {order.city ||
                    "No especificada"}
                </p>

              </div>

              {/* DIRECCIÓN */}

              <div>

                <p className="text-sm text-gray-500">
                  Dirección
                </p>

                <p className="font-semibold">
                  {order.address ||
                    "No especificada"}
                </p>

              </div>

              {/* OBSERVACIONES */}

              {order.notes && (
                <div>

                  <p className="text-sm text-gray-500">
                    Observaciones
                  </p>

                  <p className="font-semibold">
                    {order.notes}
                  </p>

                </div>
              )}

            </div>

          </section>

        </div>

        {/* ==========================================
            COLUMNA DERECHA
        ========================================== */}

        <aside className="space-y-8">

          {/* ======================================
              ESTADO
          ====================================== */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-2xl font-black">
              Estado del pedido
            </h2>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              disabled={saving}
              className="w-full rounded-xl border p-4 font-semibold outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
            >

              <option value="pending">
                Pendiente
              </option>

              <option value="confirmed">
                Confirmado
              </option>

              <option value="preparing">
                En preparación
              </option>

              <option value="shipped">
                Enviado
              </option>

              <option value="delivered">
                Entregado
              </option>

              <option value="cancelled">
                Cancelado
              </option>

            </select>

          </section>

          {/* ======================================
              PRODUCTOS
          ====================================== */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-2xl font-black">
              Productos
            </h2>

            <div className="space-y-5">

              {order.order_items?.length ? (

                order.order_items.map(
                  (item: any) => {

                    const productImage =
                      item.product_image ??
                      item.image ??
                      item.product?.image ??
                      "";

                    const productName =
                      item.product_name ??
                      item.product?.name ??
                      "Producto";

                    const color =
                      item.color ??
                      item.product_color ??
                      null;

                    const size =
                      item.size ??
                      item.product_size ??
                      null;

                    const quantity =
                      Number(
                        item.quantity ?? 0
                      );

                    const subtotal =
                      Number(
                        item.subtotal ?? 0
                      );

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 border-b pb-5 last:border-none"
                      >

                        {/* =========================
                            IMAGEN
                        ========================= */}

                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">

                          {productImage ? (

                            <Image
                              src={productImage}
                              alt={productName}
                              fill
                              sizes="96px"
                              className="object-contain p-2"
                            />

                          ) : (

                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <Package size={30} />
                            </div>

                          )}

                        </div>

                        {/* =========================
                            INFORMACIÓN
                        ========================= */}

                        <div className="min-w-0 flex-1">

                          <p className="font-bold">
                            {productName}
                          </p>

                          {color && (
                            <p className="mt-1 text-sm text-gray-500">
                              Color:{" "}

                              <span className="font-medium text-gray-700">
                                {color}
                              </span>
                            </p>
                          )}

                          <p className="mt-1 text-sm text-gray-500">
                            Talla:{" "}

                            <span className="font-medium text-gray-700">
                              {size !== null &&
                              size !== undefined &&
                              size !== ""
                                ? String(size)
                                : "No especificada"}
                            </span>
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Cantidad:{" "}

                            <span className="font-medium text-gray-700">
                              {quantity}
                            </span>
                          </p>

                        </div>

                        {/* =========================
                            SUBTOTAL
                        ========================= */}

                        <div className="shrink-0 text-right">

                          <p className="text-lg font-black">
                            $
                            {subtotal.toLocaleString(
                              "es-CO"
                            )}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )

              ) : (

                <p className="text-gray-500">
                  No hay productos registrados
                  en este pedido.
                </p>

              )}

            </div>

          </section>

          {/* ======================================
              TOTAL
          ====================================== */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">

            {/* SUBTOTAL */}

            <div className="flex justify-between">

              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-semibold">
                $
                {Number(
                  order.subtotal ?? 0
                ).toLocaleString(
                  "es-CO"
                )}
              </span>

            </div>

            {/* ENVÍO */}

            <div className="mt-4 flex justify-between">

              <span className="text-gray-500">
                Envío
              </span>

              <span className="font-semibold text-green-600">
                Gratis
              </span>

            </div>

            <div className="my-5 border-t" />

            {/* TOTAL */}

            <div className="flex justify-between">

              <span className="text-xl font-bold">
                Total
              </span>

              <span className="text-3xl font-black">
                $
                {Number(
                  order.total ?? 0
                ).toLocaleString(
                  "es-CO"
                )}
              </span>

            </div>

            {/* GUARDAR */}

            <button
              type="button"
              onClick={handleSaveStatus}
              disabled={saving}
              className="mt-8 w-full rounded-2xl bg-black py-4 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

          </section>

        </aside>

      </div>

    </div>
  );
}