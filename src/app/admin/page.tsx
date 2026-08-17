"use client";

import { useEffect, useState } from "react";

import {
  ShoppingBag,
  Clock3,
  DollarSign,
  Package,
} from "lucide-react";

import { getOrders } from "@/services/order.service";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getOrders();

        setOrders(data);
      } catch (error) {
        console.error(
          "Error cargando dashboard:",
          error
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ==========================================
  // PEDIDOS PENDIENTES
  // ==========================================

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const pending = pendingOrders.length;

  // ==========================================
  // TOTAL DE VENTAS
  // ==========================================
  //
  // Sumamos el total de todos los pedidos
  // que existen en el panel.
  //
  // ==========================================

  const sales = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  );

  // ==========================================
  // PRODUCTOS VENDIDOS
  // ==========================================

  const productsSold = orders.reduce(
    (total, order) => {
      const items = Array.isArray(
        order.order_items
      )
        ? order.order_items
        : [];

      return (
        total +
        items.reduce(
          (sum: number, item: any) =>
            sum + Number(item.quantity || 0),
          0
        )
      );
    },
    0
  );

  // ==========================================
  // ÚLTIMOS PEDIDOS
  // ==========================================

  const latestOrders = orders.slice(0, 5);

  // ==========================================
  // ESTADO
  // ==========================================

  function getStatusClass(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <>
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-10">
        <h1 className="text-5xl font-black">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Bienvenido al panel de administración de
          KickDistrict.
        </p>
      </div>

      {/* ==========================================
          CARDS
      ========================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* PEDIDOS */}

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pedidos
              </p>

              <h2 className="mt-2 text-4xl font-black">
                {loading ? "..." : orders.length}
              </h2>
            </div>

            <ShoppingBag
              size={42}
              className="text-red-600"
            />

          </div>
        </div>

        {/* PENDIENTES */}

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pendientes
              </p>

              <h2 className="mt-2 text-4xl font-black">
                {loading ? "..." : pending}
              </h2>
            </div>

            <Clock3
              size={42}
              className="text-yellow-500"
            />

          </div>
        </div>

        {/* VENTAS */}

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Ventas
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {loading
                  ? "..."
                  : `$${sales.toLocaleString("es-CO")}`}
              </h2>
            </div>

            <DollarSign
              size={42}
              className="text-green-600"
            />

          </div>
        </div>

        {/* PRODUCTOS VENDIDOS */}

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Productos vendidos
              </p>

              <h2 className="mt-2 text-4xl font-black">
                {loading ? "..." : productsSold}
              </h2>
            </div>

            <Package
              size={42}
              className="text-blue-600"
            />

          </div>
        </div>

      </div>

      {/* ==========================================
          ÚLTIMOS PEDIDOS
      ========================================== */}

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-2xl font-black">
          Últimos pedidos
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left text-sm text-gray-500">

                <th className="pb-4">
                  Cliente
                </th>

                <th className="pb-4">
                  Ciudad
                </th>

                <th className="pb-4">
                  Total
                </th>

                <th className="pb-4">
                  Estado
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-500"
                  >
                    Cargando pedidos...
                  </td>
                </tr>

              ) : latestOrders.length === 0 ? (

                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-500"
                  >
                    No hay pedidos todavía.
                  </td>
                </tr>

              ) : (

                latestOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b"
                  >

                    <td className="py-5 font-semibold">
                      {order.customer_name}
                    </td>

                    <td>
                      {order.city}
                    </td>

                    <td>
                      $
                      {Number(
                        order.total || 0
                      ).toLocaleString("es-CO")}
                    </td>

                    <td>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}