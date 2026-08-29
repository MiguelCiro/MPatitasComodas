"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";

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
      base64String + padding
    )
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(
      (character) =>
        character.charCodeAt(0)
    )
  );
}

export default function PushNotifications() {
  const [supported, setSupported] =
    useState(false);

  const [permission, setPermission] =
    useState<
      NotificationPermission | null
    >(null);

  const [loading, setLoading] =
    useState(false);

  const [enabled, setEnabled] =
    useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    if (
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    if (
      !("PushManager" in window)
    ) {
      return;
    }

    if (
      !("Notification" in window)
    ) {
      return;
    }

    setSupported(true);

    setPermission(
      Notification.permission
    );

    async function checkSubscription() {
      try {
        const registration =
          await navigator.serviceWorker.register(
            "/sw.js"
          );

        const subscription =
          await registration.pushManager.getSubscription();

        if (
          subscription &&
          Notification.permission ===
            "granted"
        ) {
          setEnabled(true);
        }
      } catch (error) {
        console.error(
          "Error comprobando Push:",
          error
        );
      }
    }

    checkSubscription();
  }, []);

  async function enableNotifications() {
    try {
      setLoading(true);

      if (!supported) {
        alert(
          "Este navegador no soporta notificaciones Push."
        );

        return;
      }

      const publicKey =
        process.env
          .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        console.error(
          "Falta NEXT_PUBLIC_VAPID_PUBLIC_KEY"
        );

        alert(
          "Falta configurar la clave pública VAPID."
        );

        return;
      }

      const newPermission =
        await Notification.requestPermission();

      setPermission(
        newPermission
      );

      if (
        newPermission !== "granted"
      ) {
        alert(
          "Las notificaciones no fueron permitidas."
        );

        return;
      }

      const registration =
        await navigator.serviceWorker.register(
          "/sw.js"
        );

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe(
            {
              userVisibleOnly: true,

              applicationServerKey:
                urlBase64ToUint8Array(
                  publicKey
                ),
            }
          );
      }

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
              subscription
            ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "No fue posible registrar las notificaciones."
        );
      }

      setEnabled(true);

      console.log(
        "🔔 Notificaciones activadas."
      );
    } catch (error) {
      console.error(
        "Error activando notificaciones:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible activar las notificaciones."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Si el navegador no soporta Push,
   * no mostramos nada.
   */

  if (!supported) {
    return null;
  }

  /*
   * Si ya están activadas,
   * mostramos una pequeña confirmación.
   */

  if (enabled) {
    return (
      <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-xl">
        <Check size={17} />

        Notificaciones activadas
      </div>
    );
  }

  /*
   * Si el usuario bloqueó las notificaciones,
   * mostramos una explicación.
   */

  if (
    permission === "denied"
  ) {
    return (
      <div className="fixed bottom-5 right-5 z-[100] max-w-xs rounded-2xl bg-white p-4 text-sm shadow-2xl ring-1 ring-gray-200">

        <p className="font-bold text-gray-900">
          Notificaciones bloqueadas
        </p>

        <p className="mt-1 text-gray-500">
          Debes permitir las notificaciones
          desde la configuración del
          navegador.
        </p>

      </div>
    );
  }

  /*
   * Botón para activar.
   */

  return (
    <button
      type="button"
      onClick={
        enableNotifications
      }
      disabled={loading}
      className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 rounded-full bg-black px-5 py-4 font-bold text-white shadow-2xl transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Bell size={20} />

      {loading
        ? "Activando..."
        : "Activar notificaciones"}
    </button>
  );
}