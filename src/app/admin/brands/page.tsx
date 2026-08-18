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
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  Brand,
} from "@/services/brand.service";

export default function BrandsPage() {

  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [name, setName] = useState("");

  const [logo, setLogo] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  async function loadBrands() {

    try {

      setLoading(true);

      const data = await getBrands();

      setBrands(data);

    } catch (error) {

      console.error(error);

      alert(
        "No se pudieron cargar las marcas."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadBrands();

  }, []);


  function openCreateForm() {

    setEditingId(null);

    setName("");

    setLogo("");

    setShowForm(true);

  }


  function openEditForm(brand: Brand) {

    setEditingId(brand.id);

    setName(brand.name);

    setLogo(brand.logo ?? "");

    setShowForm(true);

  }


  function closeForm() {

    setShowForm(false);

    setEditingId(null);

    setName("");

    setLogo("");

  }


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!name.trim()) {

      alert(
        "Escribe el nombre de la marca."
      );

      return;

    }

    setSaving(true);

    try {

      if (editingId) {

        const updated = await updateBrand(
          editingId,
          name.trim(),
          logo.trim() || null
        );

        setBrands((current) =>
          current.map((brand) =>
            brand.id === editingId
              ? updated
              : brand
          )
        );

        alert(
          "Marca actualizada correctamente."
        );

      } else {

        const created = await createBrand(
          name.trim(),
          logo.trim() || null
        );

        setBrands((current) => [
          ...current,
          created,
        ]);

        alert(
          "Marca creada correctamente."
        );

      }

      closeForm();

    } catch (error) {

      console.error(error);

      alert(
        "No se pudo guardar la marca."
      );

    } finally {

      setSaving(false);

    }

  }


  async function handleDelete(
    brand: Brand
  ) {

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la marca "${brand.name}"?`
    );

    if (!confirmed) return;

    try {

      await deleteBrand(brand.id);

      setBrands((current) =>
        current.filter(
          (item) => item.id !== brand.id
        )
      );

      alert(
        "Marca eliminada correctamente."
      );

    } catch (error) {

      console.error(error);

      alert(
        "No se pudo eliminar esta marca. Es posible que tenga productos asociados."
      );

    }

  }


  return (

    <div>

      {/* =============================== */}
      {/* ENCABEZADO */}
      {/* =============================== */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-black">

            Marcas

          </h1>

          <p className="mt-2 text-gray-500">

            Administra las marcas disponibles en la tienda.

          </p>

        </div>


        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white transition hover:bg-red-600"
        >

          <Plus size={20} />

          Nueva marca

        </button>

      </div>


      {/* =============================== */}
      {/* FORMULARIO */}
      {/* =============================== */}

      {showForm && (

        <div className="mb-8 rounded-3xl bg-white p-8 shadow">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">

                {editingId
                  ? "Editar marca"
                  : "Nueva marca"}

              </h2>

              <p className="mt-1 text-sm text-gray-500">

                {editingId
                  ? "Actualiza la información de la marca."
                  : "Agrega una nueva marca a la tienda."}

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
            className="grid gap-5 md:grid-cols-2"
          >

            <div>

              <label className="mb-2 block text-sm font-semibold">

                Nombre de la marca

              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Ej: Nike"
                className="w-full rounded-xl border p-4 outline-none focus:border-black"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-semibold">

                Logo

              </label>

              <input
                value={logo}
                onChange={(e) =>
                  setLogo(e.target.value)
                }
                placeholder="Ej: nike.png"
                className="w-full rounded-xl border p-4 outline-none focus:border-black"
              />

              <p className="mt-2 text-xs text-gray-400">

                Nombre del archivo del logo, si la marca tiene uno.

              </p>

            </div>


            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
              >

                <Check size={18} />

                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Guardar cambios"
                  : "Crear marca"}

              </button>


              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border px-6 py-3 font-bold transition hover:bg-gray-100"
              >

                Cancelar

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =============================== */}
      {/* TABLA */}
      {/* =============================== */}

      <div className="rounded-3xl bg-white shadow">

        {loading ? (

          <div className="p-10 text-center text-gray-500">

            Cargando marcas...

          </div>

        ) : brands.length === 0 ? (

          <div className="p-10 text-center text-gray-500">

            No hay marcas registradas.

          </div>

        ) : (

          /*
            Contenedor responsive:
            permite deslizar horizontalmente
            la tabla desde el móvil.
          */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px]">

              <thead className="border-b bg-gray-50">

                <tr className="text-left">

                  <th className="p-5">

                    Marca

                  </th>


                  <th className="p-5">

                    Logo

                  </th>


                  <th className="p-5 text-center">

                    Acciones

                  </th>

                </tr>

              </thead>


              <tbody>

                {brands.map((brand) => (

                  <tr
                    key={brand.id}
                    className="border-b transition hover:bg-gray-50"
                  >

                    <td className="p-5 font-bold">

                      {brand.name}

                    </td>


                    <td className="p-5 text-gray-500">

                      {brand.logo || "Sin logo"}

                    </td>


                    <td className="p-5">

                      <div className="flex justify-center gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(brand)
                          }
                          className="rounded-lg bg-yellow-400 p-3 transition hover:bg-yellow-500"
                          title="Editar marca"
                        >

                          <Pencil size={18} />

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(brand)
                          }
                          className="rounded-lg bg-red-600 p-3 text-white transition hover:bg-red-700"
                          title="Eliminar marca"
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