import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// ==========================================
// VERIFICAR SESIÓN ADMIN
// ==========================================

async function verifyAdmin(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll() {
          // No necesitamos modificar cookies aquí.
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

// ==========================================
// GET /api/admin/orders/[id]
// Obtener un pedido
// ==========================================

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    // --------------------------------------
    // AUTENTICACIÓN
    // --------------------------------------

    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No autorizado.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------
    // ID
    // --------------------------------------

    const { id } = await params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de pedido inválido.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------
    // OBTENER PEDIDO
    // --------------------------------------

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items(*)
      `)
      .eq("id", orderId)
      .single();

    if (error) {
      console.error(
        "Error obteniendo pedido:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "Pedido no encontrado.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------
    // RESPUESTA
    // --------------------------------------

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error inesperado obteniendo pedido:",
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

// ==========================================
// PATCH /api/admin/orders/[id]
// Actualizar estado
// ==========================================

export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    // --------------------------------------
    // AUTENTICACIÓN
    // --------------------------------------

    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No autorizado.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------
    // ID
    // --------------------------------------

    const { id } = await params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de pedido inválido.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------
    // BODY
    // --------------------------------------

    const body = await request.json();

    const status = body?.status;

   const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Estado de pedido inválido.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------
    // ACTUALIZAR
    // --------------------------------------

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error(
        "Error actualizando pedido:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "No fue posible actualizar el pedido.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------
    // RESPUESTA
    // --------------------------------------

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error inesperado actualizando pedido:",
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