import webpush from "web-push";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";


// ==========================================
// VAPID
// ==========================================

const publicKey =
  process.env
    .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const privateKey =
  process.env.VAPID_PRIVATE_KEY;

const subject =
  process.env.VAPID_SUBJECT;


if (!publicKey) {
  throw new Error(
    "Falta NEXT_PUBLIC_VAPID_PUBLIC_KEY en .env.local"
  );
}


if (!privateKey) {
  throw new Error(
    "Falta VAPID_PRIVATE_KEY en .env.local"
  );
}


if (!subject) {
  throw new Error(
    "Falta VAPID_SUBJECT en .env.local"
  );
}


// ==========================================
// CONFIGURAR WEB PUSH
// ==========================================

webpush.setVapidDetails(
  subject,
  publicKey,
  privateKey
);


// ==========================================
// ENVIAR NOTIFICACIÓN
// ==========================================

export async function sendPushNotification(
  payload: {
    title: string;
    body: string;
    url?: string;
  }
) {

  console.log(
    "🔥 INICIANDO ENVÍO PUSH"
  );


  try {

    // ========================================
    // OBTENER SUSCRIPCIONES
    // ========================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "push_subscriptions"
        )
        .select(
          "id, endpoint, p256dh, auth"
        );


    if (error) {

      console.error(
        "❌ Error obteniendo suscripciones:",
        error
      );

      return;
    }


    if (
      !data ||
      data.length === 0
    ) {

      console.log(
        "ℹ️ No hay administradores suscritos."
      );

      return;
    }


    console.log(
      `📡 Suscripciones encontradas: ${data.length}`
    );


    // ========================================
    // PAYLOAD
    // ========================================

    const notificationPayload =
      JSON.stringify({

        title:
          payload.title ||
          "KickDistrict",

        body:
          payload.body ||
          "Tienes un nuevo pedido.",

        icon:
          "/icon-192.png",

        badge:
          "/icon-192.png",

        tag:
          `kickdistrict-order-${Date.now()}`,

        url:
          payload.url ||
          "/admin/orders",
      });


    console.log(
      "📦 Payload:",
      notificationPayload
    );


    // ========================================
    // ENVIAR A CADA SUSCRIPCIÓN
    // ========================================

    for (
      const subscription of data
    ) {

      console.log(
        "🚀 Enviando Push a suscripción:",
        subscription.id
      );


      try {

        const response =
          await webpush.sendNotification(
            {
              endpoint:
                subscription.endpoint,

              keys: {
                p256dh:
                  subscription.p256dh,

                auth:
                  subscription.auth,
              },
            },

            notificationPayload,

            {
              TTL: 60,

              urgency:
                "high",
            }
          );


        // ====================================
        // IMPORTANTE
        // ====================================

        console.log(
          "✅ Push aceptado por el servicio:",
          {
            subscriptionId:
              subscription.id,

            statusCode:
              response.statusCode,

            headers:
              response.headers,
          }
        );


      } catch (
        error: any
      ) {

        console.error(
          "❌ ERROR ENVIANDO PUSH:",
          {
            subscriptionId:
              subscription.id,

            statusCode:
              error?.statusCode,

            body:
              error?.body,

            message:
              error?.message,
          }
        );


        // ====================================
        // SUSCRIPCIÓN EXPIRADA
        // ====================================

        if (
          error?.statusCode ===
            404 ||
          error?.statusCode ===
            410
        ) {

          console.log(
            "🗑️ Eliminando suscripción inválida:",
            subscription.id
          );


          await supabaseAdmin
            .from(
              "push_subscriptions"
            )
            .delete()
            .eq(
              "id",
              subscription.id
            );


          console.log(
            "✅ Suscripción eliminada."
          );
        }
      }
    }


    console.log(
      "🏁 PROCESO PUSH TERMINADO"
    );

  } catch (error) {

    console.error(
      "❌ Error general enviando Push:",
      error
    );
  }
}