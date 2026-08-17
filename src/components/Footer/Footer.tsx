import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">

      {/* Parte superior */}

      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">

          {/* Logo */}

          <div>

            <h2 className="text-4xl font-black tracking-tight">
              KICKDISTRICT
            </h2>

            <p className="mt-3 text-lg text-gray-400">
              Every Step Defines You.
            </p>

            <p className="mt-8 max-w-md leading-8 text-gray-400">
              Sneakers premium seleccionados para quienes viven la cultura urbana.
              Calidad, autenticidad y los modelos más exclusivos.
            </p>

          </div>

          {/* Newsletter */}

          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

            <h3 className="text-3xl font-black">
              Únete a KickDistrict
            </h3>

            <p className="mt-3 text-gray-400">
              Recibe lanzamientos exclusivos, descuentos y novedades antes que todos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="h-14 flex-1 rounded-xl border border-gray-700 bg-black px-5 outline-none transition focus:border-red-500"
              />

              <button className="h-14 rounded-xl bg-red-600 px-8 font-bold transition hover:bg-red-700">
                Suscribirme
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Línea */}

      <div className="border-t border-gray-800" />

      {/* Links */}

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Tienda */}

        <div>

          <h3 className="mb-5 text-xl font-bold">
            Tienda
          </h3>

          <div className="space-y-3 text-gray-400">

            <Link href="/nike" className="block transition hover:text-red-500">
              Nike
            </Link>

            <Link href="/jordan" className="block transition hover:text-red-500">
              Jordan
            </Link>

            <Link href="/adidas" className="block transition hover:text-red-500">
              Adidas
            </Link>

            <Link href="/new-balance" className="block transition hover:text-red-500">
              New Balance
            </Link>

            <Link href="/puma" className="block transition hover:text-red-500">
              Puma
            </Link>

          </div>

        </div>

        {/* Ayuda */}

        <div>

          <h3 className="mb-5 text-xl font-bold">
            Ayuda
          </h3>

          <div className="space-y-3 text-gray-400">

            <Link href="/" className="block transition hover:text-red-500">
              Preguntas frecuentes
            </Link>

            <Link href="/" className="block transition hover:text-red-500">
              Envíos
            </Link>

            <Link href="/" className="block transition hover:text-red-500">
              Cambios y devoluciones
            </Link>

            <Link href="/" className="block transition hover:text-red-500">
              Garantía
            </Link>

          </div>

        </div>

        {/* Contacto */}

        <div>

          <h3 className="mb-5 text-xl font-bold">
            Contacto
          </h3>

          <div className="space-y-5 text-gray-400">

            <div className="flex items-center gap-3">

              <MapPin size={18} />

              Medellín, Colombia

            </div>

            <div className="flex items-center gap-3">

              <Phone size={18} />

              +57 300 000 0000

            </div>

            <div className="flex items-center gap-3">

              <Mail size={18} />

              contacto@kickdistrict.com

            </div>

          </div>

        </div>

        {/* Redes */}

        <div>

          <h3 className="mb-5 text-xl font-bold">
            Síguenos
          </h3>

          <div className="flex gap-4">

            <a
              href="#"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 transition hover:bg-red-600"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="#"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 transition hover:bg-red-600"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="#"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 transition hover:bg-red-600"
            >
              <FaTiktok size={18} />
            </a>

            <a
              href="#"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 transition hover:bg-red-600"
            >
              <FaWhatsapp size={20} />
            </a>

          </div>

        </div>

      </div>

      {/* Parte inferior */}

      <div className="border-t border-gray-800">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-7 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 KickDistrict. Todos los derechos reservados.
          </p>

          <div className="flex gap-8">

            <Link href="/" className="hover:text-red-500">
              Privacidad
            </Link>

            <Link href="/" className="hover:text-red-500">
              Términos
            </Link>

            <Link href="/" className="hover:text-red-500">
              Cookies
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}