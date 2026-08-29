"use client";

import { useEffect } from "react";


// ============================================
// CONVERTIR VAPID PUBLIC KEY
// ============================================

function urlBase64ToUint8Array(
  base64String: string
) {
  const padding =
    "=".repeat(
      (4 -
        (base64String.length % 4)) %
        4
    );

  const base64 =
    (
      base64String +
      padding
    )
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  const outputArray =
    new Uint8Array(
      rawData.length
    );

  for (
    let i = 0;
    i < rawData.length;
    i++
  ) {
    outputArray[i] =
      rawData.charCodeAt(i);
  }

  return outputArray;
}


// ============================================
// COMPONENTE
// ============================================

export default function PushNotifications() {

  useEffect(() => {

    let cancelled = false;


    async function setupPushNotifications() {

      try {

        // ======================================
        // SOPORTE
        // ======================================

        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }


        if (
          !(
            "serviceWorker" in
            navigator
          )
        ) {

          console.warn(
            "⚠️ Service Worker no soportado."
          );

          return;
        }


        if (
          !(
            "PushManager" in
            window
          )
        ) {

          console.warn(
            "⚠️ Push Notifications no soportadas."
          );

          return;
        }


        if (
          !(
            "Notification" in
            window
          )
        ) {

          console.warn(
            "⚠️ Notifications no soportadas."
          );

          return;
        }


        // ======================================
        // VAPID
        // ======================================

        const vapidPublicKey =
          process.env
            .NEXT_PUBLIC_VAPID_PUBLIC_KEY;


        if (
          !vapidPublicKey
        ) {

          console.error(
            "❌ Falta NEXT_PUBLIC_VAPID_PUBLIC_KEY."
          );

          return;
        }


        // ======================================
        // REGISTRAR SERVICE WORKER
        // ======================================

        const registration =
          await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
              updateViaCache:
                "none",
            }
          );


        console.log(
          "✅ Service Worker registrado."
        );


        // ======================================
        // ESPERAR SERVICE WORKER
        // ======================================

        const readyRegistration =
          await navigator.serviceWorker.ready;


        if (cancelled) {
          return;
        }


        console.log(
          "✅ Service Worker listo:",
          readyRegistration.scope
        );


        // ======================================
        // PERMISOS
        // ======================================

        let permission =
          Notification.permission;


        if (
          permission ===
          "default"
        ) {

          permission =
            await Notification.requestPermission();
        }


        console.log(
          "🔔 Permiso:",
          permission
        );


        if (
          permission !==
          "granted"
        ) {

          console.warn(
            "⚠️ El administrador no permitió las notificaciones."
          );

          return;
        }


        console.log(
          "✅ Permiso de notificaciones concedido."
        );


        // ======================================
        // SUSCRIPCIÓN ACTUAL
        // ======================================

        let subscription =
          await readyRegistration
            .pushManager
            .getSubscription();


        // ======================================
        // CREAR SUSCRIPCIÓN
        // ======================================

        if (!subscription) {

          console.log(
            "🆕 Creando suscripción Push..."
          );


          subscription =
            await readyRegistration
              .pushManager
              .subscribe({
                userVisibleOnly:
                  true,

                applicationServerKey:
                  urlBase64ToUint8Array(
                    vapidPublicKey
                  ),
              });


          console.log(
            "✅ Nueva suscripción Push creada."
          );

        } else {

          console.log(
            "✅ Suscripción Push existente encontrada."
          );
        }


        // ======================================
        // MOSTRAR INFORMACIÓN
        // ======================================

        console.log(
          "🌐 Endpoint Push:",
          subscription.endpoint
        );


        // ======================================
        // ENVIAR AL SERVIDOR
        // ======================================

        const response =
          await fetch(
            "/api/push/subscribe",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                subscription.toJSON()
              ),

              credentials: "include",

              cache: "no-store",
            }
          );


        const result =
          await response.json();


        if (
          !response.ok
        ) {

          console.error(
            "❌ No se pudo registrar Push:",
            result
          );

          return;
        }


        console.log(
          "🔔 Push Notifications ACTIVADAS."
        );


        console.log(
          "📡 Suscripción registrada correctamente en el servidor."
        );

      } catch (error) {

        console.error(
          "❌ Error configurando Push Notifications:",
          error
        );
      }
    }


    setupPushNotifications();


    return () => {
      cancelled = true;
    };

  }, []);


  return null;
}