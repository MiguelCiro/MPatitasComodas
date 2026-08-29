// ============================================
// SERVICE WORKER - KICKDISTRICT
// ============================================

self.addEventListener("install", (event) => {
  console.log("🔥 Service Worker instalándose...");

  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      console.log("✅ Service Worker activado.");

      await self.clients.claim();
    })()
  );
});


// ============================================
// RECIBIR NOTIFICACIÓN PUSH
// ============================================

self.addEventListener("push", (event) => {
  console.log("🔔 PUSH RECIBIDO POR SERVICE WORKER");

  event.waitUntil(
    (async () => {

      let data = {};

      // ========================================
      // LEER PAYLOAD
      // ========================================

      if (event.data) {
        try {
          data = event.data.json();

          console.log(
            "📦 Payload recibido:",
            data
          );

        } catch (error) {

          console.warn(
            "⚠️ El payload no era JSON."
          );

          try {
            data = {
              title: "Nuevo pedido",
              body: event.data.text(),
            };
          } catch {
            data = {
              title: "Nuevo pedido",
              body: "Tienes un nuevo pedido en KickDistrict.",
            };
          }
        }
      } else {

        console.warn(
          "⚠️ Push recibido sin payload."
        );

        data = {
          title: "Nuevo pedido",
          body: "Tienes un nuevo pedido en KickDistrict.",
        };
      }


      // ========================================
      // DATOS DE LA NOTIFICACIÓN
      // ========================================

      const title =
        data.title ||
        "KickDistrict";


      const options = {
        body:
          data.body ||
          "Tienes un nuevo pedido.",

        icon:
          data.icon ||
          "/icon-192.png",

        badge:
          data.badge ||
          "/icon-192.png",

        vibrate: [
          200,
          100,
          200,
        ],

        tag:
          data.tag ||
          `kickdistrict-${Date.now()}`,

        renotify: true,

        requireInteraction: true,

        timestamp: Date.now(),

        data: {
          url:
            data.url ||
            "/admin/orders",
        },
      };


      console.log(
        "📢 Mostrando notificación:",
        title,
        options
      );


      // ========================================
      // MOSTRAR NOTIFICACIÓN
      // ========================================

      await self.registration.showNotification(
        title,
        options
      );

      console.log(
        "✅ Notificación mostrada."
      );

    })()
  );
});


// ============================================
// CLICK EN NOTIFICACIÓN
// ============================================

self.addEventListener(
  "notificationclick",
  (event) => {

    console.log(
      "🖱️ Click en notificación."
    );

    event.notification.close();


    const url =
      event.notification?.data?.url ||
      "/admin/orders";


    event.waitUntil(
      (async () => {

        const clientList =
          await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
          });


        // ======================================
        // BUSCAR ADMIN YA ABIERTO
        // ======================================

        for (const client of clientList) {

          if (
            "focus" in client
          ) {

            try {
              await client.navigate(url);
            } catch {
              // Si ya está en la página,
              // simplemente continuamos.
            }

            return client.focus();
          }
        }


        // ======================================
        // ABRIR ADMIN
        // ======================================

        if (
          self.clients.openWindow
        ) {
          return self.clients.openWindow(
            url
          );
        }

      })()
    );
  }
);