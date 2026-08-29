import webpush from "web-push";

import { supabaseAdmin } from "@/lib/supabase-admin";

const publicKey =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const privateKey =
  process.env.VAPID_PRIVATE_KEY;

const email =
  process.env.VAPID_EMAIL;

if (!publicKey) {
  throw new Error(
    "Falta NEXT_PUBLIC_VAPID_PUBLIC_KEY"
  );
}

if (!privateKey) {
  throw new Error(
    "Falta VAPID_PRIVATE_KEY"
  );
}

if (!email) {
  throw new Error(
    "Falta VAPID_EMAIL"
  );
}

webpush.setVapidDetails(
  email,
  publicKey,
  privateKey
);

export async function sendPushNotification(
  payload: {
    title: string;
    body: string;
    url?: string;
  }
) {
  const { data, error } =
    await supabaseAdmin
      .from("push_subscriptions")
      .select(
        "id, endpoint, p256dh, auth"
      );

  if (error) {
    console.error(
      "Error obteniendo suscripciones:",
      error
    );

    return;
  }

  if (!data || data.length === 0) {
    console.log(
      "No hay administradores suscritos a notificaciones."
    );

    return;
  }

  const notificationPayload =
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url ?? "/admin/orders",
    });

  for (const subscription of data) {
    try {
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
        notificationPayload
      );
    } catch (error: any) {
      console.error(
        "Error enviando push:",
        error
      );

      /*
       * Si el navegador ya no tiene
       * activa la suscripción, la eliminamos.
       */

      if (
        error?.statusCode === 404 ||
        error?.statusCode === 410
      ) {
        await supabaseAdmin
          .from("push_subscriptions")
          .delete()
          .eq(
            "id",
            subscription.id
          );
      }
    }
  }
}