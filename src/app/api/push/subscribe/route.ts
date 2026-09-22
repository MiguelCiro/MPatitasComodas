import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

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
// REGISTRAR SUSCRIPCIÓN PUSH
// ============================================

export async function POST(
  request: NextRequest
) {
  try {

    // ========================================
    // OBTENER USUARIO AUTENTICADO
    // ========================================

    const supabase =
      await createSupabaseServerClient();

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();


    if (
      userError ||
      !user
    ) {

      console.error(
        "❌ Usuario no autenticado al registrar Push:",
        userError
      );

      return NextResponse.json(
        {
          error:
            "Debes iniciar sesión para activar las notificaciones.",
        },
        {
          status: 401,
        }
      );
    }


    console.log(
      "👤 Usuario autenticado:",
      user.id
    );

    console.log(
      "📧 Email:",
      user.email
    );


    // ========================================
    // LEER BODY
    // ========================================

    const body =
      await request.json();


    const endpoint =
      body?.endpoint;

    const keys =
      body?.keys;


    // ========================================
    // VALIDAR SUSCRIPCIÓN
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
    // GUARDAR SUSCRIPCIÓN
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
            user_id:
              user.id,

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
          "id, user_id, endpoint"
        )
        .single();


    // ========================================
    // ERROR SUPABASE
    // ========================================

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


    // ========================================
    // ÉXITO
    // ========================================

    console.log(
      "✅ Suscripción Push registrada:"
    );

    console.log(
      "🆔 Subscription ID:",
      data?.id
    );

    console.log(
      "👤 User ID:",
      data?.user_id
    );


    return NextResponse.json(
      {
        success: true,

        subscriptionId:
          data?.id,

        userId:
          data?.user_id,
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