"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Productos",
    icon: Package,
    href: "/admin/products",
  },
  {
    title: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/admin/customers",
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-white">

      <div className="border-b px-8 py-8">

        <h1 className="text-3xl font-black">
          KICKDISTRICT
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Panel Administrativo
        </p>

      </div>

      <nav className="flex-1 p-5">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <Link
              key={item.title}
              href={item.href}
              className="mb-3 flex items-center gap-4 rounded-2xl px-5 py-4 text-gray-700 transition hover:bg-black hover:text-white"
            >

              <Icon size={22} />

              <span className="font-semibold">
                {item.title}
              </span>

            </Link>

          );

        })}

      </nav>

      <div className="border-t p-5">

        <button
          className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-red-600 transition hover:bg-red-600 hover:text-white"
        >

          <LogOut size={22} />

          <span className="font-semibold">
            Cerrar sesión
          </span>

        </button>

      </div>

    </aside>
  );
}