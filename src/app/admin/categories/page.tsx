"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/services/category.service";

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [name, setName] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function loadCategories() {
    try {
      setLoading(true);

      const data =
        await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);

      alert(
        "No se pudieron cargar las categorías."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setName("");
    setShowForm(true);
  }

  function openEditForm(
    category: Category
  ) {
    setEditingId(category.id);
    setName(category.name);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setName("");
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert(
        "Escribe el nombre de la categoría."
      );
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        const updated =
          await updateCategory(
            editingId,
            name.trim()
          );

        setCategories((current) =>
          current.map((category) =>
            category.id === editingId
              ? updated
              : category
          )
        );

        alert(
          "Categoría actualizada correctamente."
        );
      } else {
        const created =
          await createCategory(
            name.trim()
          );

        setCategories((current) => [
          ...current,
          created,
        ]);

        alert(
          "Categoría creada correctamente."
        );
      }

      closeForm();
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo guardar la categoría."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    category: Category
  ) {
    const confirmed =
      window.confirm(
        `¿Seguro que deseas eliminar la categoría "${category.name}"?`
      );

    if (!confirmed) return;

    try {
      await deleteCategory(
        category.id
      );

      setCategories((current) =>
        current.filter(
          (item) =>
            item.id !== category.id
        )
      );

      alert(
        "Categoría eliminada correctamente."
      );
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo eliminar esta categoría. Es posible que tenga productos asociados."
      );
    }
  }

  return (
    <div>

      {/* Encabezado */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-black">
            Categorías
          </h1>

          <p className="mt-2 text-gray-500">
            Organiza los productos de la tienda por categoría.
          </p>

        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white transition hover:bg-red-600"
        >
          <Plus size={20} />

          Nueva categoría
        </button>

      </div>

      {/* Formulario */}

      {showForm && (
        <div className="mb-8 rounded-3xl bg-white p-8 shadow">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                {editingId
                  ? "Editar categoría"
                  : "Nueva categoría"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Actualiza el nombre de la categoría."
                  : "Agrega una nueva categoría para organizar productos."}
              </p>

            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <X size={22} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 md:flex-row"
          >

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Ej: Hombre"
              className="flex-1 rounded-xl border p-4 outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              <Check size={18} />

              {saving
                ? "Guardando..."
                : editingId
                ? "Guardar cambios"
                : "Crear categoría"}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border px-6 py-4 font-bold transition hover:bg-gray-100"
            >
              Cancelar
            </button>

          </form>

        </div>
      )}

      {/* Tabla */}

      <div className="overflow-hidden rounded-3xl bg-white shadow">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Cargando categorías...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No hay categorías registradas.
          </div>
        ) : (
          <table className="w-full">

            <thead className="border-b bg-gray-50">

              <tr className="text-left">

                <th className="p-5">
                  Categoría
                </th>

                <th className="p-5 text-center">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {categories.map(
                (category) => (

                  <tr
                    key={category.id}
                    className="border-b transition hover:bg-gray-50"
                  >

                    <td className="p-5 font-bold">
                      {category.name}
                    </td>

                    <td className="p-5">

                      <div className="flex justify-center gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              category
                            )
                          }
                          className="rounded-lg bg-yellow-400 p-3 transition hover:bg-yellow-500"
                          title="Editar categoría"
                        >
                          <Pencil
                            size={18}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              category
                            )
                          }
                          className="rounded-lg bg-red-600 p-3 text-white transition hover:bg-red-700"
                          title="Eliminar categoría"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}