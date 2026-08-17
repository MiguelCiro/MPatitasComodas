"use client";

import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/hooks/useCart";
import Dropdown from "@/components/Dropdown/Dropdown";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import SearchModal from "@/components/SearchModal/SearchModal";

export default function Header() {
  const {
    totalItems,
    isCartOpen,
    openCart,
    closeCart,
  } = useCart();

  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* ============================= */}
          {/* LOGO */}
          {/* ============================= */}

          <Link href="/">
            <div>
              <h1 className="text-2xl font-black lg:text-3xl">
                KICKDISTRICT
              </h1>

              <p className="text-[10px] uppercase tracking-[4px] text-gray-500 lg:text-xs lg:tracking-[5px]">
                Every Step Defines You
              </p>
            </div>
          </Link>

          {/* ============================= */}
          {/* MENÚ ESCRITORIO */}
          {/* ============================= */}

          <nav className="hidden items-center gap-10 lg:flex">

            {/* HOMBRE */}

            <Dropdown
              title="Hombre"
              items={[
                {
                  label: "Nike",
                  href: "/nike",
                },
                {
                  label: "Jordan",
                  href: "/jordan",
                },
                {
                  label: "Adidas",
                  href: "/adidas",
                },
                {
                  label: "New Balance",
                  href: "/new-balance",
                },
                {
                  label: "Puma",
                  href: "/puma",
                },
                {
                  label: "Converse",
                  href: "/converse",
                },
              ]}
            />

            {/* MUJER */}

            <Dropdown
              title="Mujer"
              items={[
                {
                  label: "Nike",
                  href: "/nike",
                },
                {
                  label: "Jordan",
                  href: "/jordan",
                },
                {
                  label: "Adidas",
                  href: "/adidas",
                },
                {
                  label: "New Balance",
                  href: "/new-balance",
                },
                {
                  label: "Puma",
                  href: "/puma",
                },
                {
                  label: "Converse",
                  href: "/converse",
                },
              ]}
            />

            {/* LANZAMIENTOS */}

            <Link
              href="/lanzamientos"
              className="font-semibold transition hover:text-red-600"
            >
              Lanzamientos
            </Link>

            {/* OFERTAS */}

            <Link
              href="/ofertas"
              className="font-semibold transition hover:text-red-600"
            >
              Ofertas
            </Link>

          </nav>

          {/* ============================= */}
          {/* ICONOS */}
          {/* ============================= */}

          <div className="flex items-center gap-4 lg:gap-6">

            {/* MENÚ MÓVIL */}

            <button
              type="button"
              onClick={() => setOpenMenu(true)}
              className="lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={26} />
            </button>

            {/* BUSCADOR */}

            <button
              type="button"
              onClick={() => setOpenSearch(true)}
              aria-label="Buscar productos"
            >
              <Search
                size={22}
                className="transition hover:text-red-600"
              />
            </button>

            {/* FAVORITOS */}

            <Link
              href="/favorites"
              aria-label="Favoritos"
              className="hidden sm:block"
            >
              <Heart
                size={22}
                className="cursor-pointer transition hover:text-red-600"
              />
            </Link>

            {/* CARRITO */}

            <button
              type="button"
              onClick={openCart}
              className="relative cursor-pointer"
              aria-label="Abrir carrito"
            >
              <ShoppingBag
                size={22}
                className="transition hover:text-red-600"
              />

              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* ====================================== */}
      {/* OVERLAY MENÚ MÓVIL */}
      {/* ====================================== */}

      <div
        onClick={() => setOpenMenu(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition ${
          openMenu
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ====================================== */}
      {/* DRAWER MENÚ MÓVIL */}
      {/* ====================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-80 bg-white p-8 shadow-2xl transition-transform duration-300 ${
          openMenu
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* ENCABEZADO */}

        <div className="mb-12 flex items-center justify-between">

          <h2 className="text-2xl font-black">
            Menú
          </h2>

          <button
            type="button"
            onClick={() => setOpenMenu(false)}
            aria-label="Cerrar menú"
          >
            <X size={28} />
          </button>

        </div>

        {/* NAVEGACIÓN MÓVIL */}

        <nav className="flex flex-col gap-7">

          {/* HOMBRE */}

          <Link
            href="/hombre"
            onClick={() => setOpenMenu(false)}
            className="text-lg font-semibold transition hover:text-red-600"
          >
            Hombre
          </Link>

          {/* MUJER */}

          <Link
            href="/mujer"
            onClick={() => setOpenMenu(false)}
            className="text-lg font-semibold transition hover:text-red-600"
          >
            Mujer
          </Link>

          {/* LANZAMIENTOS */}

          <Link
            href="/lanzamientos"
            onClick={() => setOpenMenu(false)}
            className="text-lg font-semibold transition hover:text-red-600"
          >
            Lanzamientos
          </Link>

          {/* OFERTAS */}

          <Link
            href="/ofertas"
            onClick={() => setOpenMenu(false)}
            className="text-lg font-semibold transition hover:text-red-600"
          >
            Ofertas
          </Link>

          <hr className="my-2" />

          {/* FAVORITOS */}

          <Link
            href="/favorites"
            onClick={() => setOpenMenu(false)}
            className="text-lg font-semibold transition hover:text-red-600"
          >
            Favoritos
          </Link>

        </nav>

      </aside>

      {/* ====================================== */}
      {/* CARRITO */}
      {/* ====================================== */}

      <CartDrawer
        open={isCartOpen}
        onClose={closeCart}
      />

      {/* ====================================== */}
      {/* BUSCADOR */}
      {/* ====================================== */}

      <SearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
      />

    </>
  );
}