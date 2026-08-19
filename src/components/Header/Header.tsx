"use client";

import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
  ArrowUpRight,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!openMenu) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [openMenu]);

  function closeMobileMenu() {
    setOpenMenu(false);
  }

  return (
    <>
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <header className="relative z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* ============================= */}
          {/* LOGO */}
          {/* ============================= */}

          <Link
            href="/"
            className="group"
          >
            <div>
              <h1 className="text-2xl font-black tracking-tight transition group-hover:text-red-600 lg:text-3xl">
                KICKDISTRICT
              </h1>

              <p className="text-[9px] uppercase tracking-[3px] text-gray-500 sm:text-[10px] sm:tracking-[4px] lg:text-xs lg:tracking-[5px]">
                Every Step Defines You
              </p>
            </div>
          </Link>

          {/* ============================= */}
          {/* MENÚ ESCRITORIO */}
          {/* ============================= */}

          <nav className="hidden items-center gap-10 lg:flex">

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

            <Link
              href="/lanzamientos"
              className="font-semibold transition hover:text-red-600"
            >
              Lanzamientos
            </Link>

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
              className="flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-gray-100 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={27} strokeWidth={2.2} />
            </button>

            {/* BUSCADOR */}

            <button
              type="button"
              onClick={() => setOpenSearch(true)}
              aria-label="Buscar productos"
              className="flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-gray-100"
            >
              <Search
                size={23}
                className="transition hover:text-red-600"
              />
            </button>

            {/* FAVORITOS */}

            <Link
              href="/favorites"
              aria-label="Favoritos"
              className="hidden h-11 w-11 items-center justify-center rounded-xl transition hover:bg-gray-100 sm:flex"
            >
              <Heart
                size={22}
                className="transition hover:text-red-600"
              />
            </Link>

            {/* CARRITO */}

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-gray-100"
              aria-label="Abrir carrito"
            >
              <ShoppingBag
                size={23}
                className="transition hover:text-red-600"
              />

              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
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
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          openMenu
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ====================================== */}
      {/* MENÚ MÓVIL PREMIUM */}
      {/* ====================================== */}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col overflow-y-auto bg-[#070707] text-white transition-transform duration-500 ease-out lg:hidden ${
          openMenu
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        aria-hidden={!openMenu}
      >

        {/* ============================= */}
        {/* ENCABEZADO */}
        {/* ============================= */}

        <div className="flex items-start justify-between border-b border-white/10 px-6 pb-6 pt-7">

          <div>
            <p className="text-2xl font-black tracking-tight">
              KICKDISTRICT
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[4px] text-white/50">
              Every Step Defines You
            </p>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 transition hover:rotate-90 hover:bg-white hover:text-black"
            aria-label="Cerrar menú"
          >
            <X size={23} />
          </button>

        </div>

        {/* ============================= */}
        {/* NAVEGACIÓN PRINCIPAL */}
        {/* ============================= */}

        <nav className="px-6 py-8">

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="group flex items-center justify-between border-b border-white/10 py-5"
          >
            <div className="flex items-center gap-4">

              <span className="text-xs font-bold tracking-[2px] text-red-500">
                01
              </span>

              <span className="text-2xl font-black">
                Inicio
              </span>

            </div>

            <ArrowUpRight
              size={21}
              className="text-white/40 transition group-hover:text-red-500"
            />
          </Link>

          <Link
            href="/hombre"
            onClick={closeMobileMenu}
            className="group flex items-center justify-between border-b border-white/10 py-5"
          >
            <div className="flex items-center gap-4">

              <span className="text-xs font-bold tracking-[2px] text-red-500">
                02
              </span>

              <span className="text-2xl font-black">
                Hombre
              </span>

            </div>

            <ArrowUpRight
              size={21}
              className="text-white/40 transition group-hover:text-red-500"
            />
          </Link>

          <Link
            href="/mujer"
            onClick={closeMobileMenu}
            className="group flex items-center justify-between border-b border-white/10 py-5"
          >
            <div className="flex items-center gap-4">

              <span className="text-xs font-bold tracking-[2px] text-red-500">
                03
              </span>

              <span className="text-2xl font-black">
                Mujer
              </span>

            </div>

            <ArrowUpRight
              size={21}
              className="text-white/40 transition group-hover:text-red-500"
            />
          </Link>

          <Link
            href="/unisex"
            onClick={closeMobileMenu}
            className="group flex items-center justify-between border-b border-white/10 py-5"
          >
            <div className="flex items-center gap-4">

              <span className="text-xs font-bold tracking-[2px] text-red-500">
                04
              </span>

              <span className="text-2xl font-black">
                Unisex
              </span>

            </div>

            <ArrowUpRight
              size={21}
              className="text-white/40 transition group-hover:text-red-500"
            />
          </Link>

        </nav>

        {/* ============================= */}
        {/* MARCAS */}
        {/* ============================= */}

        <section className="border-t border-white/10 px-6 py-8">

          <p className="mb-5 text-xs font-bold uppercase tracking-[3px] text-white/40">
            Explora por marca
          </p>

          <div className="grid grid-cols-2 gap-3">

            <Link
              href="/nike"
              onClick={closeMobileMenu}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 font-semibold transition hover:border-red-500 hover:bg-red-600"
            >
              Nike
            </Link>

            <Link
              href="/jordan"
              onClick={closeMobileMenu}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 font-semibold transition hover:border-red-500 hover:bg-red-600"
            >
              Jordan
            </Link>

            <Link
              href="/adidas"
              onClick={closeMobileMenu}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 font-semibold transition hover:border-red-500 hover:bg-red-600"
            >
              Adidas
            </Link>

            <Link
              href="/new-balance"
              onClick={closeMobileMenu}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 font-semibold transition hover:border-red-500 hover:bg-red-600"
            >
              New Balance
            </Link>

            <Link
              href="/puma"
              onClick={closeMobileMenu}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 font-semibold transition hover:border-red-500 hover:bg-red-600"
            >
              Puma
            </Link>

            <Link
              href="/converse"
              onClick={closeMobileMenu}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 font-semibold transition hover:border-red-500 hover:bg-red-600"
            >
              Converse
            </Link>

          </div>

        </section>

        {/* ============================= */}
        {/* COLECCIONES */}
        {/* ============================= */}

        <section className="border-t border-white/10 px-6 py-8">

          <p className="mb-5 text-xs font-bold uppercase tracking-[3px] text-white/40">
            Colecciones
          </p>

          <div className="flex flex-col gap-3">

            <Link
              href="/lanzamientos"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-bold text-black transition hover:bg-red-600 hover:text-white"
            >
              Nuevos lanzamientos

              <ArrowUpRight size={20} />
            </Link>

            <Link
              href="/ofertas"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-2xl border border-red-500 bg-red-600 px-5 py-4 font-bold text-white transition hover:bg-red-700"
            >
              Ver ofertas

              <ArrowUpRight size={20} />
            </Link>

          </div>

        </section>

        {/* ============================= */}
        {/* FAVORITOS */}
        {/* ============================= */}

        <section className="mt-auto border-t border-white/10 px-6 py-6">

          <Link
            href="/favorites"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 text-sm font-semibold text-white/70 transition hover:text-red-500"
          >
            <Heart size={20} />

            Favoritos
          </Link>

          <p className="mt-6 text-[10px] uppercase tracking-[3px] text-white/30">
            KickDistrict · Medellín, Colombia
          </p>

        </section>

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