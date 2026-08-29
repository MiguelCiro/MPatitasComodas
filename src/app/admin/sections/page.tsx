"use client";

import { Layers } from "lucide-react";

export default function SectionsPage() {
  return (
    <div className="min-w-0">
      {/* =============================== */}
      {/* ENCABEZADO */}
      {/* =============================== */}

      <div className="mb-8 sm:mb-10">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Secciones
        </h1>

        <p className="mt-2 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
          Administra las secciones disponibles en la tienda.
        </p>
      </div>

      {/* =============================== */}
      {/* CONTENIDO */}
      {/* =============================== */}

      <div className="rounded-2xl bg-white p-6 shadow sm:rounded-3xl sm:p-10">
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <Layers
              size={38}
              className="text-gray-400"
            />
          </div>

          <h2 className="mt-6 text-2xl font-black">
            Gestión de secciones
          </h2>

          <p className="mt-3 max-w-md leading-relaxed text-gray-500">
            Esta sección está lista para administrar el contenido
            y las secciones que quieras mostrar en MPatitas Cómodas.
          </p>
        </div>
      </div>
    </div>
  );
}