"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getProducts,
  deleteProduct,
} from "@/services/product.service";

import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  async function loadProducts() {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(
        "Error cargando productos:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(
    product: Product
  ) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter(
          (item) => item.id !== product.id
        )
      );

      alert("Producto eliminado correctamente.");
    } catch (error) {
      console.error(
        "Error eliminando producto:",
        error
      );

      alert(
        error instanceof Error
          ? `No se pudo eliminar el producto.\n\n${error.message}`
          : "No se pudo eliminar el producto."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-w-0">

      {/* Encabezado */}

      <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Productos
          </h1>

          <p className="mt-2 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
            Administra todos los productos de la tienda.
          </p>

        </div>

        <Link
          href="/admin/products/new"
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white transition hover:bg-red-600 sm:w-auto"
        >
          <Plus size={20} />

          Nuevo producto
        </Link>

      </div>

      {/* Contenido */}

      <div className="overflow-hidden rounded-2xl bg-white shadow sm:rounded-3xl">

        {loading ? (

          <div className="p-8 text-center text-gray-500 sm:p-10">
            Cargando productos...
          </div>

        ) : products.length === 0 ? (

          <div className="p-8 text-center text-gray-500 sm:p-10">
            No hay productos registrados.
          </div>

        ) : (

          <>
            {/* Vista escritorio / tablet */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[850px]">

                <thead className="border-b bg-gray-50">

                  <tr className="text-left">

                    <th className="p-5">
                      Producto
                    </th>

                    <th className="p-5">
                      Marca
                    </th>

                    <th className="p-5">
                      Categoría
                    </th>

                    <th className="p-5">
                      Precio
                    </th>

                    <th className="p-5">
                      Stock
                    </th>

                    <th className="p-5 text-center">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => (

                      <tr
                        key={product.id}
                        className="border-b transition hover:bg-gray-50"
                      >

                        <td className="max-w-[250px] p-5 font-bold">
                          {product.name}
                        </td>

                        <td className="p-5">
                          {product.name ??
                            "Sin marca"}
                        </td>

                        <td className="p-5">
                          {product.category?.name ??
                            "Sin categoría"}
                        </td>

                        <td className="whitespace-nowrap p-5">
                          $
                          {product.price.toLocaleString(
                            "es-CO"
                          )}
                        </td>

                        <td className="p-5">
                          {product.stock}
                        </td>

                        <td className="p-5">

                          <div className="flex justify-center gap-3">

                            <Link
                              href={`/admin/products/${product.id}`}
                              title="Editar producto"
                              className="rounded-lg bg-yellow-400 p-3 transition hover:bg-yellow-500"
                            >
                              <Pencil size={18} />
                            </Link>

                            <button
                              type="button"
                              title="Eliminar producto"
                              disabled={
                                deletingId ===
                                product.id
                              }
                              onClick={() =>
                                handleDelete(product)
                              }
                              className="rounded-lg bg-red-600 p-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* Vista móvil */}

            <div className="divide-y md:hidden">

              {products.map(
                (product) => (

                  <div
                    key={product.id}
                    className="p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <h2 className="break-words text-lg font-black">
                          {product.name}
                        </h2>

                        <div className="mt-3 space-y-1 text-sm text-gray-500">

                          <p>
                            <span className="font-semibold text-gray-700">
                              Marca:
                            </span>{" "}
                            {product.name ??
                              "Sin marca"}
                          </p>

                          <p>
                            <span className="font-semibold text-gray-700">
                              Categoría:
                            </span>{" "}
                            {product.category?.name ??
                              "Sin categoría"}
                          </p>

                          <p>
                            <span className="font-semibold text-gray-700">
                              Stock:
                            </span>{" "}
                            {product.stock}
                          </p>

                        </div>

                        <p className="mt-3 text-base font-black">
                          $
                          {product.price.toLocaleString(
                            "es-CO"
                          )}
                        </p>

                      </div>

                      <div className="flex shrink-0 flex-col gap-2">

                        <Link
                          href={`/admin/products/${product.id}`}
                          title="Editar producto"
                          aria-label={`Editar ${product.name}`}
                          className="rounded-lg bg-yellow-400 p-3 transition hover:bg-yellow-500"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          type="button"
                          title="Eliminar producto"
                          aria-label={`Eliminar ${product.name}`}
                          disabled={
                            deletingId ===
                            product.id
                          }
                          onClick={() =>
                            handleDelete(product)
                          }
                          className="rounded-lg bg-red-600 p-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>
          </>

        )}

      </div>

    </div>
  );
}