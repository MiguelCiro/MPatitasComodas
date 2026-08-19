"use client";

export default function WhatsAppButton() {
  const phone = "57310******";

  const message =
    "Hola 👋, vi la tienda KickDistrict y tengo una duda.";

  const url =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-6 right-6 z-[999] block"
    >
      {/* Tooltip */}

      <div className="pointer-events-none absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-black px-4 py-2 text-sm font-medium text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100">
        ¿Necesitas ayuda?
      </div>

      {/* Botón */}

      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-400/60">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="absolute left-[51.5%] top-[50%] h-9 w-9 -translate-x-1/2 -translate-y-1/2 fill-white" aria-hidden="true">
          <path d="M19.11 17.33c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.44.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36 0 1.39 1.02 2.74 1.16 2.93.14.19 2.01 3.07 4.88 4.31.68.29 1.21.47 1.63.6.69.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.35.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.55-.34z" />

          <path d="M16.02 3C8.83 3 3 8.82 3 16c0 2.54.73 5.01 2.11 7.14L3 29l5.99-2.05A13 13 0 0016.02 29C23.2 29 29 23.18 29 16S23.2 3 16.02 3zm0 23.66c-2.1 0-4.15-.56-5.94-1.63l-.42-.25-3.56 1.22 1.19-3.47-.27-.44A10.64 10.64 0 015.36 16c0-5.88 4.78-10.66 10.66-10.66S26.68 10.12 26.68 16s-4.78 10.66-10.66 10.66z" />
        </svg>

      </div>
    </a>
  );
}