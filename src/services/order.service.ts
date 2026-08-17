import { supabase } from "@/lib/supabase";

import { Order, OrderItem } from "@/types/order";

// =======================================
// Crear pedido
// =======================================

export async function createOrder(order: Order) {

  const { data, error } = await supabase

    .from("orders")

    .insert(order)

    .select()

    .single();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}

// =======================================
// Guardar productos del pedido
// =======================================

export async function createOrderItems(

  items: OrderItem[]

) {

  const { error } = await supabase

    .from("order_items")

    .insert(items);

  if (error) {

    console.error(error);

    throw error;

  }

}

// =======================================
// Obtener todos los pedidos
// (Panel administrador)
// =======================================

export async function getOrders() {
  try {
    const response = await fetch("/api/admin/orders", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Error obteniendo pedidos:",
        response.status
      );

      return [];
    }

    const result = await response.json();

    return result.data ?? [];
  } catch (error) {
    console.error(
      "Error cargando pedidos:",
      error
    );

    return [];
  }
}

// =======================================
// Obtener un pedido
// =======================================

export async function getOrder(id: number) {
  try {
    const response = await fetch(
      `/api/admin/orders/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Error obteniendo pedido:",
        response.status
      );

      return null;
    }

    const result = await response.json();

    return result.data ?? null;
  } catch (error) {
    console.error(
      "Error cargando pedido:",
      error
    );

    return null;
  }
}

// =======================================
// Actualizar estado
// (Panel administrador)
// =======================================

// =======================================
// Actualizar estado del pedido
// (Panel administrador)
// =======================================

export async function updateOrderStatus(
  id: number,
  status: string
) {
  try {
    const response = await fetch(
      `/api/admin/orders/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Error actualizando pedido:",
        result
      );

      throw new Error(
        result.message ||
          "No fue posible actualizar el pedido."
      );
    }

    return result.data;
  } catch (error) {
    console.error(
      "Error actualizando estado:",
      error
    );

    throw error;
  }
}

// =======================================
// Total de ventas
// =======================================

export async function getTotalSales() {

  const { data, error } = await supabase
    .from("orders")
    .select("total");

  if (error) {
    console.error(error);
    return 0;
  }

  return data.reduce(
    (acc, order) => acc + Number(order.total),
    0
  );

}

// =======================================
// Pedidos pendientes
// =======================================

export async function getPendingOrders() {

  const { count, error } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "pending");

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;

}

// =======================================
// Actualizar estado del pedido
// =======================================
