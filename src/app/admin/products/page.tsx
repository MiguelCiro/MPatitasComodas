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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadProducts() {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      alert("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando producto:", error);

      alert(
        "No se pudo eliminar el producto. Revisa la consola para más información."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>

      {/* Encabezado */}

      <div className="mb-10 flex items-center justify-between">

        <div>
          <h1 className="text-5xl font-black">
            Productos
          </h1>

          <p className="mt-2 text-gray-500">
            Administra todos los productos de la tienda.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white transition hover:bg-red-600"
        >
          <Plus size={20} />

          Nuevo producto
        </Link>

      </div>

      {/* Tabla */}

      <div className="overflow-hidden rounded-3xl bg-white shadow">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No hay productos registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

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

                {products.map((product) => (

                  <tr
                    key={product.id}
                    className="border-b transition hover:bg-gray-50"
                  >

                    <td className="p-5 font-bold">
                      {product.name}
                    </td>

                    <td className="p-5">
                      {product.brand?.name ?? "Sin marca"}
                    </td>

                    <td className="p-5">
                      {product.category?.name ?? "Sin categoría"}
                    </td>

                    <td className="p-5">
                      $
                      {product.price.toLocaleString("es-CO")}
                    </td>

                    <td className="p-5">
                      {product.stock}
                    </td>

                    <td className="p-5">

                      <div className="flex justify-center gap-3">

                        {/* EDITAR */}

                        <Link
                          href={`/admin/products/${product.id}`}
                          title="Editar producto"
                          className="rounded-lg bg-yellow-400 p-3 transition hover:bg-yellow-500"
                        >
                          <Pencil size={18} />
                        </Link>

                        {/* ELIMINAR */}

                        <button
                          type="button"
                          title="Eliminar producto"
                          disabled={deletingId === product.id}
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

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}