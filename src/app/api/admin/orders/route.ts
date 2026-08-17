import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  try {
    // ==========================================
    // VERIFICAR SESIÓN
    // ==========================================

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll() {
            // No necesitamos modificar cookies en esta consulta.
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "No autorizado.",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // OBTENER PEDIDOS
    // ==========================================

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items(*)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error obteniendo pedidos desde Supabase:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "No fue posible obtener los pedidos.",
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
        data: data ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error inesperado en /api/admin/orders:",
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