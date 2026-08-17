import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CheckoutItem = {
  product_id: number;
  size: number;
  quantity: number;
};

type CheckoutBody = {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  department: string;
  city: string;
  address: string;
  notes?: string;
  items: CheckoutItem[];
};

export async function POST(request: NextRequest) {
  try {
    // ==========================================
    // LEER BODY
    // ==========================================

    const body = (await request.json()) as CheckoutBody;

    const {
      customer_name,
      customer_email,
      customer_phone,
      department,
      city,
      address,
      notes,
      items,
    } = body;

    // ==========================================
    // VALIDACIONES BÁSICAS
    // ==========================================

    if (
      !customer_name ||
      !customer_phone ||
      !department ||
      !city ||
      !address
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Completa todos los campos obligatorios.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "El pedido no contiene productos.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // VALIDAR ITEMS
    // ==========================================

    for (const item of items) {
      if (
        !Number.isInteger(item.product_id) ||
        !Number.isInteger(item.size) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Uno de los productos del pedido no es válido.",
          },
          { status: 400 }
        );
      }
    }

    // ==========================================
    // OBTENER PRODUCTOS REALES
    // ==========================================

    const productIds = [
      ...new Set(items.map((item) => item.product_id)),
    ];

    const { data: products, error: productsError } =
      await supabaseAdmin
        .from("products")
        .select("*")
        .in("id", productIds);

    if (productsError) {
      console.error(
        "Error obteniendo productos:",
        productsError
      );

      return NextResponse.json(
        {
          success: false,
          message: "No fue posible verificar los productos.",
        },
        { status: 500 }
      );
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Uno o más productos ya no están disponibles.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // VALIDAR STOCK, TALLAS Y CALCULAR TOTAL
    // ==========================================

    const orderItems = [];

    let subtotal = 0;

    for (const item of items) {
      const product = products.find(
        (p) => Number(p.id) === Number(item.product_id)
      );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: "Producto no encontrado.",
          },
          { status: 400 }
        );
      }

      // ------------------------------
      // STOCK
      // ------------------------------

      if (
        product.stock !== null &&
        product.stock !== undefined &&
        Number(product.stock) < item.quantity
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `No hay suficiente stock de ${product.name}.`,
          },
          { status: 400 }
        );
      }

      // ------------------------------
      // TALLA
      // ------------------------------

      if (Array.isArray(product.sizes)) {
        const availableSizes = product.sizes.map(Number);

        if (!availableSizes.includes(Number(item.size))) {
          return NextResponse.json(
            {
              success: false,
              message: `La talla ${item.size} no está disponible para ${product.name}.`,
            },
            { status: 400 }
          );
        }
      }

      // ------------------------------
      // PRECIO REAL
      // ------------------------------

      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          {
            success: false,
            message: `El precio del producto ${product.name} no es válido.`,
          },
          { status: 500 }
        );
      }

      const itemSubtotal = price * item.quantity;

      subtotal += itemSubtotal;

      // ------------------------------
      // DATOS PARA order_items
      // ------------------------------

      orderItems.push({
        product_id: Number(product.id),
        product_name: product.name,
        brand:
          typeof product.brand === "string"
            ? product.brand
            : product.brand?.name ?? "",
        size: Number(item.size),
        quantity: Number(item.quantity),
        price,
        subtotal: itemSubtotal,
      });
    }

    // ==========================================
    // ENVÍO
    // ==========================================

    const shipping = 0;

    const total = subtotal + shipping;

    // ==========================================
    // CREAR ORDER
    // ==========================================

    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .insert({
          customer_name,
          customer_email: customer_email ?? "",
          customer_phone,
          department,
          city,
          address,
          notes: notes ?? "",
          subtotal,
          shipping,
          total,
          status: "pending",
          payment_status: "pending",
          payment_method: "demo",
        })
        .select("id")
        .single();

    if (orderError) {
      console.error(
        "Error creando pedido:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          message: "No fue posible crear el pedido.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // CREAR ORDER ITEMS
    // ==========================================

    const itemsToInsert = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } =
      await supabaseAdmin
        .from("order_items")
        .insert(itemsToInsert);

    if (itemsError) {
      console.error(
        "Error creando productos del pedido:",
        itemsError
      );

      // ========================================
      // LIMPIAR ORDER SI FALLAN LOS ITEMS
      // ========================================

      await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          success: false,
          message:
            "No fue posible guardar los productos del pedido.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // RESPUESTA
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error inesperado en /api/orders:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}