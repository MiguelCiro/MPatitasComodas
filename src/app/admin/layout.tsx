"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Shapes,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { auth } from "@/lib/auth";

import PushNotifications from "@/components/PushNotifications/PushNotifications";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const menu = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Pedidos",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Productos",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Categorías",
      href: "/admin/categories",
      icon: Shapes,
    },
  ];

  async function handleLogout() {
    try {
      console.log("🔴 INICIANDO LOGOUT");

      const { error } =
        await auth.auth.signOut({
          scope: "global",
        });

      if (error) {
        console.error(
          "❌ Error Supabase:",
          error
        );
      } else {
        console.log(
          "✅ Supabase signOut completado"
        );
      }

      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        }
      );

      console.log(
        "✅ Logout del servidor completado"
      );

      window.location.replace(
        "/login"
      );
    } catch (error) {
      console.error(
        "❌ Error durante logout:",
        error
      );

      window.location.replace(
        "/login"
      );
    }
  }

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* =========================================
          SISTEMA DE NOTIFICACIONES
      ========================================= */}

      <PushNotifications />

      {/* =========================================
          BOTÓN MOBILE
      ========================================= */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">

        <div>
          <h1 className="text-xl font-black">
            Mpatitas Comodas
          </h1>

          <p className="text-xs text-gray-500">
            Panel administrador
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>

      </header>

      {/* =========================================
          OVERLAY MOBILE
      ========================================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r bg-white
          transition-transform duration-300
          md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* =====================================
            LOGO
        ====================================== */}

        <div className="flex items-start justify-between border-b px-8 py-8">

          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Mpatitas Comodas
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Panel administrador
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>

        </div>

        {/* =====================================
            MENÚ
        ====================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <div className="space-y-2">

            {menu.map((item) => {
              const Icon = item.icon;
              const active =
                isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={`
                    flex items-center gap-4 rounded-2xl
                    px-5 py-4 text-base font-semibold
                    transition
                    ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon size={22} />

                  <span>
                    {item.title}
                  </span>
                </Link>
              );
            })}

          </div>

        </nav>

        {/* =====================================
            CERRAR SESIÓN
        ====================================== */}

        <div className="border-t p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} />

            <span>
              Cerrar sesión
            </span>
          </button>

        </div>

      </aside>

      {/* =========================================
          CONTENIDO PRINCIPAL
      ========================================= */}

      <main className="min-h-screen w-full px-4 py-6 sm:px-6 md:ml-72 md:w-[calc(100%-18rem)] md:px-8 md:py-10 lg:px-10">

        {children}

      </main>

    </div>
  );
}