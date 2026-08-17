"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Shapes,
  Tags,
  LogOut,
} from "lucide-react";

import { auth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
    {
      title: "Marcas",
      href: "/admin/brands",
      icon: Tags,
    },
  ];

  async function handleLogout() {
  try {
    console.log("🔴 INICIANDO LOGOUT");

    // 1. Cerrar sesión del cliente de Supabase
    const { error } = await auth.auth.signOut({
      scope: "global",
    });

    if (error) {
      console.error("❌ Error Supabase:", error);
    } else {
      console.log("✅ Supabase signOut completado");
    }

    // 2. Limpiar también la sesión del servidor
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    console.log("✅ Logout del servidor completado");

    // 3. Navegación COMPLETA, no solamente navegación de Next
    window.location.replace("/login");
  } catch (error) {
    console.error("❌ Error durante logout:", error);

    window.location.replace("/login");
  }
}

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">

        {/* =====================================
            SIDEBAR
        ====================================== */}

        <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r bg-white">

          {/* LOGO */}

          <div className="border-b px-8 py-8">
            <h1 className="text-3xl font-black">
              KickDistrict
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Panel administrador
            </p>
          </div>

          {/* =====================================
              MENÚ
          ====================================== */}

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">

              {menu.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-semibold transition ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
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
              <span>Cerrar sesión</span>
            </button>

          </div>

        </aside>

        {/* =====================================
            CONTENIDO PRINCIPAL
        ====================================== */}

        <main className="ml-72 min-h-screen flex-1 p-10">
          {children}
        </main>

      </div>
    </div>
  );
}