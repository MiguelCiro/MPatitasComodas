import Link from "next/link";

import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">

      {/* =========================================
          PARTE SUPERIOR
      ========================================= */}

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16">

        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-14">

          {/* LOGO */}

          <div className="min-w-0">

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              MPATITAS CÓMODAS
            </h2>

            <p className="mt-3 text-sm uppercase tracking-[3px] text-gray-400 sm:text-lg sm:tracking-[4px]">
              Comodidad para cada paso.
            </p>

            <p className="mt-7 max-w-md text-sm leading-7 text-gray-400 sm:mt-8 sm:text-base sm:leading-8">
              Calcetines diseñados para acompañarte
              en cada paso. Comodidad, calidad,
              color y estilos para cada personalidad.
            </p>

          </div>

          {/* NEWSLETTER */}

          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-5 sm:p-8">

            <h3 className="text-xl font-black sm:text-3xl">
              Únete a MPatitas Cómodas
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Recibe promociones, descuentos,
              nuevos estilos y novedades antes que
              todos.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">

              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="
                  h-14
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-gray-700
                  bg-black
                  px-5
                  text-sm
                  outline-none
                  transition
                  focus:border-red-500
                "
              />

              <button
                type="button"
                className="
                  h-14
                  shrink-0
                  rounded-xl
                  bg-red-600
                  px-7
                  font-bold
                  transition
                  hover:bg-red-700
                "
              >
                Suscribirme
              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-gray-800" />

      {/* =========================================
          LINKS
      ========================================= */}

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14">

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-4 lg:gap-12">

          {/* TIENDA */}

          <div className="min-w-0">

            <h3 className="mb-5 text-lg font-bold sm:text-xl">
              Tienda
            </h3>

            <div className="space-y-3 text-sm text-gray-400 sm:text-base">

              <Link
                href="/hombre"
                className="block transition hover:text-red-500"
              >
                Hombre
              </Link>

              <Link
                href="/mujer"
                className="block transition hover:text-red-500"
              >
                Mujer
              </Link>

              <Link
                href="/ninos"
                className="block transition hover:text-red-500"
              >
                Niños
              </Link>

              <Link
                href="/personajes"
                className="block transition hover:text-red-500"
              >
                Personajes
              </Link>

              <Link
                href="/antideslizantes"
                className="block transition hover:text-red-500"
              >
                Antideslizantes
              </Link>

              <Link
                href="/compresion"
                className="block transition hover:text-red-500"
              >
                Compresión
              </Link>

            </div>

          </div>

          {/* AYUDA */}

          <div className="min-w-0">

            <h3 className="mb-5 text-lg font-bold sm:text-xl">
              Ayuda
            </h3>

            <div className="space-y-3 text-sm text-gray-400 sm:text-base">

              <Link
                href="/pagos"
                className="block transition hover:text-red-500"
              >
                Métodos de pago
              </Link>

              <Link
                href="/terminos"
                className="block transition hover:text-red-500"
              >
                Términos y condiciones
              </Link>

              <Link
                href="/privacidad"
                className="block transition hover:text-red-500"
              >
                Política de privacidad
              </Link>

              <Link
                href="/cookies"
                className="block transition hover:text-red-500"
              >
                Política de cookies
              </Link>

            </div>

          </div>

          {/* CONTACTO */}

          <div className="min-w-0 border-t border-gray-800 pt-8 lg:border-t-0 lg:pt-0">

            <h3 className="mb-5 text-lg font-bold sm:text-xl">
              Contacto
            </h3>

            <div className="space-y-5 text-sm text-gray-400 sm:text-base">

              {/* UBICACIÓN */}

              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="mt-1 shrink-0"
                />

                <span className="leading-6">
                  Medellín, Colombia
                </span>

              </div>

              {/* TELÉFONO */}

              <a
                href="tel:+573248343679"
                className="flex items-start gap-3 transition hover:text-red-500"
              >

                <Phone
                  size={18}
                  className="mt-1 shrink-0"
                />

                <span className="whitespace-nowrap">
                  +57 324 834 3679
                </span>

              </a>

              {/* CORREO */}

              <a
                href="mailto:mpatitascomodas@gmail.com"
                className="flex items-start gap-3 transition hover:text-red-500"
              >

                <Mail
                  size={18}
                  className="mt-1 shrink-0"
                />

                <span className="break-words leading-6">
                  mpatitascomodas@gmail.com
                </span>

              </a>

            </div>

          </div>

          {/* REDES */}

          <div className="min-w-0 border-t border-gray-800 pt-8 lg:border-t-0 lg:pt-0">

            <h3 className="mb-5 text-lg font-bold sm:text-xl">
              Síguenos
            </h3>

            <div className="flex flex-wrap gap-3">

              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/mpatitascomodas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-900
                  transition
                  hover:bg-red-600
                "
              >
                <FaInstagram size={19} />
              </a>

              {/* WHATSAPP */}

              <a
                href="https://wa.me/573248343679"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-900
                  transition
                  hover:bg-red-600
                "
              >
                <FaWhatsapp size={19} />
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          PARTE INFERIOR
      ========================================= */}

      <div className="border-t border-gray-800">

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-5
            px-5
            py-7
            text-center
            text-sm
            text-gray-500
            md:flex-row
            md:text-left
            sm:px-6
          "
        >

          <p className="max-w-md leading-6">
            © 2026 MPatitas Cómodas. Todos los
            derechos reservados.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">

            <Link
              href="/privacidad"
              className="whitespace-nowrap transition hover:text-red-500"
            >
              Privacidad
            </Link>

            <Link
              href="/terminos"
              className="whitespace-nowrap transition hover:text-red-500"
            >
              Términos
            </Link>

            <Link
              href="/cookies"
              className="whitespace-nowrap transition hover:text-red-500"
            >
              Cookies
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}