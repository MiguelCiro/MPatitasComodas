"use client";

import { useEffect, useState } from "react";

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
    }
  }, [id]);

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

      alert("Estado actualizado correctamente.");
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-semibold">
          Cargando pedido...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-semibold">
          Pedido no encontrado.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl p-10">

        {/* VOLVER */}

        <Link
          href="/admin/orders"
          className="mb-8 inline-flex items-center gap-2 font-semibold hover:text-red-600"
        >
          <ArrowLeft size={18} />
          Volver a pedidos
        </Link>

        {/* HEADER */}

        <h1 className="text-5xl font-black">
          Pedido #{order.id}
        </h1>

        <p className="mt-2 text-gray-500">
          Información completa del pedido.
        </p>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.8fr]">

          {/* ==========================================
              COLUMNA IZQUIERDA
          ========================================== */}

          <div className="space-y-8">

            {/* CLIENTE */}

            <section className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 flex items-center gap-3 text-2xl font-black">
                <Package
                  size={26}
                  className="text-red-600"
                />

                Información del cliente
              </h2>

              <div className="space-y-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Nombre
                  </p>

                  <p className="text-lg font-bold">
                    {order.customer_name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Mail
                    size={18}
                    className="text-gray-500"
                  />

                  <span>
                    {order.customer_email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone
                    size={18}
                    className="text-gray-500"
                  />

                  <span>
                    {order.customer_phone}
                  </span>
                </div>

              </div>
            </section>

            {/* DIRECCIÓN */}

            <section className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 flex items-center gap-3 text-2xl font-black">
                <MapPin
                  size={26}
                  className="text-red-600"
                />

                Dirección de entrega
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Departamento
                  </p>

                  <p className="font-semibold">
                    {order.department}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Ciudad
                  </p>

                  <p className="font-semibold">
                    {order.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Dirección
                  </p>

                  <p className="font-semibold">
                    {order.address}
                  </p>
                </div>

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

            {/* ESTADO */}

            <section className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-black">
                Estado del pedido
              </h2>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
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

            {/* PRODUCTOS */}

            <section className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-black">
                Productos
              </h2>

              <div className="space-y-5">

                {order.order_items?.map(
                  (item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-5 last:border-none"
                    >

                      <div>

                        <p className="font-bold">
                          {item.product_name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.brand}
                        </p>

                        <p className="mt-1 text-sm">
                          Talla {item.size}
                        </p>

                        <p className="mt-1 text-sm">
                          Cantidad: {item.quantity}
                        </p>

                      </div>

                      <p className="text-lg font-black">
                        $
                        {Number(
                          item.subtotal
                        ).toLocaleString(
                          "es-CO"
                        )}
                      </p>

                    </div>
                  )
                )}

              </div>
            </section>

            {/* TOTAL */}

            <section className="rounded-3xl bg-white p-8 shadow-sm">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  $
                  {Number(
                    order.subtotal
                  ).toLocaleString(
                    "es-CO"
                  )}
                </span>

              </div>

              <div className="mt-4 flex justify-between">

                <span className="text-gray-500">
                  Envío
                </span>

                <span className="font-semibold text-green-600">
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
                  {Number(
                    order.total
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
    </main>
  );
}