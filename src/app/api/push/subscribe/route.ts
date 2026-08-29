import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";


// ============================================
// CONFIGURACIÓN
// ============================================

export const dynamic =
  "force-dynamic";

export const revalidate = 0;


// ============================================
// POST
// REGISTRAR SUSCRIPCIÓN
// ============================================

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();


    const endpoint =
      body?.endpoint;

    const keys =
      body?.keys;


    // ========================================
    // VALIDAR
    // ========================================

    if (
      !endpoint ||
      !keys?.p256dh ||
      !keys?.auth
    ) {

      console.error(
        "❌ Suscripción Push inválida:",
        body
      );

      return NextResponse.json(
        {
          error:
            "Suscripción Push inválida.",
        },
        {
          status: 400,
        }
      );
    }


    console.log(
      "📡 Registrando suscripción Push..."
    );

    console.log(
      "🌐 Endpoint:",
      endpoint
    );


    // ========================================
    // GUARDAR / ACTUALIZAR
    // ========================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "push_subscriptions"
        )
        .upsert(
          {
            endpoint,

            p256dh:
              keys.p256dh,

            auth:
              keys.auth,

            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "endpoint",
          }
        )
        .select(
          "id, endpoint"
        )
        .single();


    if (error) {

      console.error(
        "❌ Error guardando suscripción Push:",
        error
      );

      return NextResponse.json(
        {
          error:
            "No se pudo guardar la suscripción.",

          details:
            error.message,
        },
        {
          status: 500,
        }
      );
    }


    console.log(
      "✅ Suscripción Push registrada:",
      data?.id
    );


    return NextResponse.json(
      {
        success: true,

        subscriptionId:
          data?.id,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "❌ Error en /api/push/subscribe:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}