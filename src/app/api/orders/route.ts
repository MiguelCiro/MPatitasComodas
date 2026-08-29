import { NextRequest, NextResponse } from "next/server";
import * as webpush from "web-push";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ======================================================
// CONFIGURACIÓN DE WEB PUSH
// ======================================================

const vapidPublicKey =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const vapidPrivateKey =
  process.env.VAPID_PRIVATE_KEY;

const vapidSubject =
  process.env.VAPID_SUBJECT;

if (
  vapidPublicKey &&
  vapidPrivateKey &&
  vapidSubject
) {
  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  );
}

// ======================================================
// TIPOS
// ======================================================

type PaymentMethod =
  | "transfer"
  | "cash_on_delivery";

type CheckoutItem = {
  product_id: number;
  color: string;
  quantity: number;
  size?: string;
};

type CheckoutBody = {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  department: string;
  city: string;
  address: string;
  notes?: string;
  payment_method: PaymentMethod;
  items: CheckoutItem[];
};

// ======================================================
// FUNCIÓN PARA NOTIFICAR AL ADMIN
// ======================================================

async function notifyAdminNewOrder({
  orderId,
  customerName,
  total,
  items,
}: {
  orderId: number | string;
  customerName: string;
  total: number;
  items: CheckoutItem[];
}) {
  try {
    // --------------------------------------------------
    // Verificar configuración
    // --------------------------------------------------

    if (
      !vapidPublicKey ||
      !vapidPrivateKey ||
      !vapidSubject
    ) {
      console.error(
        "Push no configurado: faltan variables VAPID."
      );

      return;
    }

    // --------------------------------------------------
    // Obtener suscripciones del administrador
    // --------------------------------------------------

    const {
      data: subscriptions,
      error: subscriptionsError,
    } = await supabaseAdmin
      .from("push_subscriptions")
      .select(
        "id, endpoint, p256dh, auth"
      );

    if (subscriptionsError) {
      console.error(
        "Error obteniendo suscripciones Push:",
        subscriptionsError
      );

      return;
    }

    if (
      !subscriptions ||
      subscriptions.length === 0
    ) {
      console.log(
        "No hay dispositivos registrados para recibir notificaciones."
      );

      return;
    }

    // --------------------------------------------------
    // Crear contenido de la notificación
    // --------------------------------------------------

    const productCount =
      items.reduce(
        (totalItems, item) =>
          totalItems + Number(item.quantity),
        0
      );

    const notificationPayload =
      JSON.stringify({
        title: "🛍️ Nuevo pedido",
        body: `${customerName} realizó un pedido de ${productCount} producto${
          productCount === 1 ? "" : "s"
        } por $${Number(
          total
        ).toLocaleString("es-CO")}.`,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: `order-${orderId}`,
        data: {
          orderId: String(orderId),
          url: `/admin/orders`,
        },
      });

    // --------------------------------------------------
    // Enviar a todos los dispositivos registrados
    // --------------------------------------------------

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint:
              subscription.endpoint,
            keys: {
              p256dh:
                subscription.p256dh,
              auth: subscription.auth,
            },
          },
          notificationPayload
        );

        console.log(
          `🔔 Notificación enviada correctamente. Suscripción: ${subscription.id}`
        );
      } catch (pushError: any) {
        console.error(
          `Error enviando Push a la suscripción ${subscription.id}:`,
          pushError
        );

        // ------------------------------------------------
        // Si el navegador ya no tiene la suscripción,
        // eliminamos el registro para no seguir intentando.
        // ------------------------------------------------

        const statusCode =
          pushError?.statusCode;

        if (
          statusCode === 404 ||
          statusCode === 410
        ) {
          await supabaseAdmin
            .from("push_subscriptions")
            .delete()
            .eq(
              "id",
              subscription.id
            );

          console.log(
            `🗑️ Suscripción Push eliminada: ${subscription.id}`
          );
        }
      }
    }
  } catch (error) {
    // --------------------------------------------------
    // IMPORTANTE:
    //
    // Si falla la notificación NO debe fallar el pedido.
    // El pedido ya fue guardado correctamente.
    // --------------------------------------------------

    console.error(
      "Error general enviando notificación Push:",
      error
    );
  }
}

// ======================================================
// CREAR PEDIDO
// ======================================================

export async function POST(
  request: NextRequest
) {
  try {
    // ==========================================
    // LEER BODY
    // ==========================================

    const body =
      (await request.json()) as CheckoutBody;

    const {
      customer_name,
      customer_email,
      customer_phone,
      department,
      city,
      address,
      notes,
      payment_method,
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
          message:
            "Completa todos los campos obligatorios.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALIDAR MÉTODO DE PAGO
    // ==========================================

    if (
      payment_method !== "transfer" &&
      payment_method !==
        "cash_on_delivery"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selecciona un método de pago válido.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALIDAR ITEMS
    // ==========================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El pedido no contiene productos.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALIDAR CADA ITEM
    // ==========================================

    for (const item of items) {
      if (
        !Number.isInteger(
          item.product_id
        ) ||
        typeof item.color !==
          "string" ||
        item.color.trim().length ===
          0 ||
        !Number.isInteger(
          item.quantity
        ) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Uno de los productos del pedido no es válido.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ==========================================
    // OBTENER PRODUCTOS REALES
    // ==========================================

    const productIds = [
      ...new Set(
        items.map(
          (item) => item.product_id
        )
      ),
    ];

    const {
      data: products,
      error: productsError,
    } = await supabaseAdmin
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
          message:
            "No fue posible verificar los productos.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !products ||
      products.length !==
        productIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Uno o más productos ya no están disponibles.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALIDAR STOCK, COLORES Y TOTAL
    // ==========================================

    const orderItems: Array<{
      product_id: number;
      product_name: string;
      product_image: string;
      price: number;
      quantity: number;
      size: string;
      color: string;
    }> = [];

    let subtotal = 0;

    for (const item of items) {
      const product =
        products.find(
          (product) =>
            Number(product.id) ===
            Number(item.product_id)
        );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Producto no encontrado.",
          },
          {
            status: 400,
          }
        );
      }

      // ========================================
      // VALIDAR STOCK
      // ========================================

      if (
        product.stock !== null &&
        product.stock !== undefined &&
        Number(product.stock) <
          item.quantity
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `No hay suficiente stock de ${product.name}.`,
          },
          {
            status: 400,
          }
        );
      }

      // ========================================
      // VALIDAR COLOR
      // ========================================

      if (
        Array.isArray(
          product.colors
        ) &&
        product.colors.length > 0
      ) {
        const availableColors =
          product.colors.map(
            (color: unknown) =>
              String(color)
                .trim()
                .toLowerCase()
          );

        const selectedColor =
          item.color
            .trim()
            .toLowerCase();

        if (
          !availableColors.includes(
            selectedColor
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                `El color "${item.color}" no está disponible para ${product.name}.`,
            },
            {
              status: 400,
            }
          );
        }
      }

      // ========================================
      // PRECIO REAL
      // ========================================

      const price = Number(
        product.price
      );

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `El precio del producto ${product.name} no es válido.`,
          },
          {
            status: 500,
          }
        );
      }

      const itemSubtotal =
        price * item.quantity;

      subtotal += itemSubtotal;

      // ========================================
      // DATOS PARA ORDER_ITEMS
      // ========================================

      orderItems.push({
        product_id:
          Number(product.id),

        product_name:
          String(product.name),

        product_image:
          String(
            product.image ?? ""
          ),

        price,

        quantity:
          Number(item.quantity),

        size:
          item.size?.trim() ?? "",

        color:
          item.color.trim(),
      });
    }

    // ==========================================
    // ENVÍO
    // ==========================================

    const shipping = 0;

    const total =
      subtotal + shipping;

    // ==========================================
    // CREAR PEDIDO
    // ==========================================

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name,

        customer_email:
          customer_email ?? "",

        customer_phone,

        department,

        city,

        address,

        notes:
          notes ?? "",

        subtotal,

        shipping,

        total,

        status:
          "pending",

        payment_status:
          "pending",

        payment_method,
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
          message:
            orderError.message ||
            "No fue posible crear el pedido.",
        },
        {
          status: 500,
        }
      );
    }

    // ==========================================
    // CREAR PRODUCTOS DEL PEDIDO
    // ==========================================

    const itemsToInsert =
      orderItems.map(
        (item) => ({
          ...item,
          order_id:
            order.id,
        })
      );

    const {
      error: itemsError,
    } = await supabaseAdmin
      .from("order_items")
      .insert(
        itemsToInsert
      );

    if (itemsError) {
      console.error(
        "Error creando productos del pedido:",
        itemsError
      );

      // ========================================
      // ELIMINAR PEDIDO SI FALLAN LOS ITEMS
      // ========================================

      await supabaseAdmin
        .from("orders")
        .delete()
        .eq(
          "id",
          order.id
        );

      return NextResponse.json(
        {
          success: false,
          message:
            itemsError.message ||
            "No fue posible guardar los productos del pedido.",
        },
        {
          status: 500,
        }
      );
    }

    // ==========================================
    // DESCONTAR STOCK
    // ==========================================

    for (const item of items) {
      const product =
        products.find(
          (product) =>
            Number(product.id) ===
            Number(item.product_id)
        );

      if (!product) {
        continue;
      }

      const newStock =
        Math.max(
          0,
          Number(
            product.stock ?? 0
          ) -
            Number(
              item.quantity
            )
        );

      const {
        error: stockError,
      } = await supabaseAdmin
        .from("products")
        .update({
          stock: newStock,
        })
        .eq(
          "id",
          product.id
        );

      if (stockError) {
        console.error(
          "Error actualizando stock:",
          stockError
        );
      }
    }

    // ==========================================
    // 🔔 NOTIFICAR AL ADMINISTRADOR
    // ==========================================

    await notifyAdminNewOrder({
      orderId: order.id,

      customerName:
        customer_name,

      total,

      items,
    });

    // ==========================================
    // RESPUESTA
    // ==========================================

    return NextResponse.json(
      {
        success: true,

        orderId:
          order.id,

        paymentMethod:
          payment_method,

        total,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Error inesperado en /api/orders:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}