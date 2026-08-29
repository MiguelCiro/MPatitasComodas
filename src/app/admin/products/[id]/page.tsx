"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import {
  getProducts,
  updateProduct,
} from "@/services/product.service";

import {
  uploadProductImage,
} from "@/services/storage.service";

import {
  Product,
  ProductCategory,
  ProductColorImage,
} from "@/types/product";

// ======================================
// TIPOS
// ======================================

type Category = {
  id: number;
  name: ProductCategory;
};

const AVAILABLE_COLORS = [
  "Negro",
  "Blanco",
  "Rojo",
  "Azul",
  "Verde",
  "Amarillo",
  "Gris",
  "Beige",
  "Rosado",
  "Morado",
  "Naranja",
  "Café",
];

// ======================================
// PÁGINA
// ======================================

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Number(params.id);

  const [product, setProduct] =
    useState<Product | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingColor, setUploadingColor] =
    useState<string | null>(null);

  const [uploadingMainImage, setUploadingMainImage] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================
  // FORMULARIO
  // ======================================

  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    image: "",
    featured: false,
    is_new: false,
    colors: [] as string[],
    color_images: [] as ProductColorImage[],
    category_id: "",
  });

  // ======================================
  // CARGAR DATOS
  // ======================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        // Cargar producto
        const products = await getProducts();

        const foundProduct =
          products.find(
            (item) => item.id === productId
          ) ?? null;

        if (!foundProduct) {
          setError("No se encontró el producto.");
          setLoading(false);
          return;
        }

        setProduct(foundProduct);

        // Cargar categorías
        const {
          data: categoriesData,
          error: categoriesError,
        } = await supabase
          .from("categories")
          .select("id, name")
          .order("name");

        if (categoriesError) {
          console.error(
            "Error cargando categorías:",
            categoriesError
          );
        }

        setCategories(
          (categoriesData ?? []) as Category[]
        );

        // Normalizar imágenes por color
        const normalizedColorImages:
          ProductColorImage[] =
          Array.isArray(foundProduct.color_images)
            ? foundProduct.color_images
            : [];

        // Colores existentes
        const existingColors =
          Array.isArray(foundProduct.colors)
            ? foundProduct.colors
            : [];

        // Si hay imágenes por color pero colors está vacío,
        // obtenemos los colores desde color_images
        const colors =
          existingColors.length > 0
            ? existingColors
            : normalizedColorImages.map(
                (item) => item.color
              );

        setForm({
          slug: foundProduct.slug ?? "",
          name: foundProduct.name ?? "",
          description:
            foundProduct.description ?? "",
          price:
            foundProduct.price?.toString() ?? "",
          original_price:
            foundProduct.original_price?.toString() ??
            "",
          stock:
            foundProduct.stock?.toString() ?? "",
          image: foundProduct.image ?? "",
          featured:
            foundProduct.featured ?? false,
          is_new:
            foundProduct.is_new ?? false,
          colors,
          color_images: normalizedColorImages,
          category_id:
            foundProduct.category_id?.toString() ??
            "",
        });
      } catch (error) {
        console.error(
          "Error cargando producto:",
          error
        );

        setError(
          "No fue posible cargar el producto."
        );
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(productId)) {
      loadData();
    }
  }, [productId]);

  // ======================================
  // ACTUALIZAR CAMPOS
  // ======================================

  function updateField(
    field: string,
    value:
      | string
      | boolean
      | string[]
      | ProductColorImage[]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ======================================
  // SELECCIONAR / QUITAR COLOR
  // ======================================

  function toggleColor(color: string) {
    setForm((current) => {
      const alreadySelected =
        current.colors.includes(color);

      // Quitar color
      if (alreadySelected) {
        return {
          ...current,

          colors: current.colors.filter(
            (item) => item !== color
          ),

          // También eliminamos su imagen
          color_images:
            current.color_images.filter(
              (item) => item.color !== color
            ),
        };
      }

      // Agregar color
      return {
        ...current,
        colors: [
          ...current.colors,
          color,
        ],
      };
    });
  }

  // ======================================
  // OBTENER IMAGEN DE UN COLOR
  // ======================================

  function getColorImage(color: string) {
    const found =
      form.color_images.find(
        (item) => item.color === color
      );

    return found?.image ?? "";
  }

  // ======================================
  // SUBIR IMAGEN PRINCIPAL
  // ======================================

  async function handleMainImageUpload(
    file: File | undefined
  ) {
    if (!file) return;

    try {
      setUploadingMainImage(true);

      const imageUrl =
        await uploadProductImage(file);

      setForm((current) => ({
        ...current,
        image: imageUrl,
      }));
    } catch (error) {
      console.error(
        "Error subiendo imagen principal:",
        error
      );

      alert(
        "No fue posible subir la imagen."
      );
    } finally {
      setUploadingMainImage(false);
    }
  }

  // ======================================
  // SUBIR IMAGEN PARA UN COLOR
  // ======================================

  async function handleColorImageUpload(
    color: string,
    file: File | undefined
  ) {
    if (!file) return;

    try {
      setUploadingColor(color);

      const imageUrl =
        await uploadProductImage(file);

      setForm((current) => {
        const alreadyExists =
          current.color_images.some(
            (item) => item.color === color
          );

        let newColorImages:
          ProductColorImage[];

        // Si ya existe, reemplazamos
        if (alreadyExists) {
          newColorImages =
            current.color_images.map(
              (item) =>
                item.color === color
                  ? {
                      color,
                      image: imageUrl,
                    }
                  : item
            );
        } else {
          // Si no existe, agregamos
          newColorImages = [
            ...current.color_images,
            {
              color,
              image: imageUrl,
            },
          ];
        }

        return {
          ...current,
          color_images: newColorImages,

          // Aseguramos que el color exista
          colors: current.colors.includes(color)
            ? current.colors
            : [
                ...current.colors,
                color,
              ],
        };
      });
    } catch (error) {
      console.error(
        "Error subiendo imagen del color:",
        error
      );

      alert(
        `No fue posible subir la imagen para ${color}.`
      );
    } finally {
      setUploadingColor(null);
    }
  }

  // ======================================
  // ELIMINAR IMAGEN DE COLOR
  // ======================================

  function removeColorImage(color: string) {
    setForm((current) => ({
      ...current,

      color_images:
        current.color_images.filter(
          (item) => item.color !== color
        ),
    }));
  }

  // ======================================
  // GUARDAR
  // ======================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.name.trim()) {
        throw new Error(
          "El nombre del producto es obligatorio."
        );
      }

      if (!form.slug.trim()) {
        throw new Error(
          "El slug es obligatorio."
        );
      }

      if (!form.category_id) {
        throw new Error(
          "Selecciona una categoría."
        );
      }

      if (!form.image) {
        throw new Error(
          "El producto debe tener una imagen principal."
        );
      }

      if (Number(form.price) < 0) {
        throw new Error(
          "El precio no puede ser negativo."
        );
      }

      if (Number(form.stock) < 0) {
        throw new Error(
          "El stock no puede ser negativo."
        );
      }

      await updateProduct(productId, {
        slug: form.slug.trim(),
        name: form.name.trim(),
        description:
          form.description.trim(),
        price: Number(form.price),
        original_price:
          form.original_price.trim() !== ""
            ? Number(form.original_price)
            : null,
        stock: Number(form.stock),
        image: form.image,
        featured: form.featured,
        is_new: form.is_new,
        colors: form.colors,
        color_images: form.color_images,
        category_id: Number(form.category_id),
      });

      alert(
        "Producto actualizado correctamente."
      );

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(
        "Error actualizando producto:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el producto."
      );
    } finally {
      setSaving(false);
    }
  }

  // ======================================
  // CARGANDO
  // ======================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2
            className="animate-spin"
            size={24}
          />

          <span>
            Cargando producto...
          </span>
        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error && !product) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-black">
          Error
        </h1>

        <p className="mt-3 text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/products")
          }
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white"
        >
          <ArrowLeft size={18} />

          Volver a productos
        </button>
      </div>
    );
  }

  // ======================================
  // INTERFAZ
  // ======================================

  return (
    <div className="mx-auto max-w-6xl">

      {/* Encabezado */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <button
            type="button"
            onClick={() =>
              router.push("/admin/products")
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={18} />

            Volver a productos
          </button>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Editar producto
          </h1>

          <p className="mt-2 text-gray-500">
            Modifica la información, colores e
            imágenes del producto.
          </p>
        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {/* INFORMACIÓN */}

        <section className="rounded-3xl bg-white p-6 shadow sm:p-8">

          <h2 className="text-2xl font-black">
            Información del producto
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* Nombre */}

            <div>
              <label className="mb-2 block font-bold">
                Nombre
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Slug */}

            <div>
              <label className="mb-2 block font-bold">
                Slug
              </label>

              <input
                type="text"
                value={form.slug}
                onChange={(event) =>
                  updateField(
                    "slug",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Precio */}

            <div>
              <label className="mb-2 block font-bold">
                Precio
              </label>

              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Precio anterior */}

            <div>
              <label className="mb-2 block font-bold">
                Precio anterior
                <span className="ml-2 text-sm font-normal text-gray-400">
                  Opcional
                </span>
              </label>

              <input
                type="number"
                min="0"
                value={form.original_price}
                onChange={(event) =>
                  updateField(
                    "original_price",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Stock */}

            <div>
              <label className="mb-2 block font-bold">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) =>
                  updateField(
                    "stock",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Categoría */}

            <div>
              <label className="mb-2 block font-bold">
                Categoría
              </label>

              <select
                value={form.category_id}
                onChange={(event) =>
                  updateField(
                    "category_id",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="">
                  Selecciona una categoría
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          {/* Descripción */}

          <div className="mt-5">
            <label className="mb-2 block font-bold">
              Descripción
            </label>

            <textarea
              rows={5}
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

        </section>

        {/* IMAGEN PRINCIPAL */}

        <section className="rounded-3xl bg-white p-6 shadow sm:p-8">

          <h2 className="text-2xl font-black">
            Imagen principal
          </h2>

          <p className="mt-2 text-gray-500">
            Esta será la imagen principal del
            producto.
          </p>

          <div className="mt-6">

            {form.image ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200">

                <div className="relative aspect-square max-w-md bg-gray-100">

                  <Image
                    src={form.image}
                    alt={form.name}
                    fill
                    className="object-contain"
                  />

                </div>

              </div>
            ) : (
              <div className="flex aspect-square max-w-md items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                Sin imagen
              </div>
            )}

            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white transition hover:bg-red-600">

              {uploadingMainImage ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Subiendo...
                </>
              ) : (
                <>
                  <ImagePlus size={18} />

                  Cambiar imagen
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingMainImage}
                onChange={(event) =>
                  handleMainImageUpload(
                    event.target.files?.[0]
                  )
                }
                className="hidden"
              />

            </label>

          </div>

        </section>

        {/* COLORES */}

        <section className="rounded-3xl bg-white p-6 shadow sm:p-8">

          <h2 className="text-2xl font-black">
            Colores disponibles
          </h2>

          <p className="mt-2 text-gray-500">
            Selecciona los colores que existen
            para este producto.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            {AVAILABLE_COLORS.map(
              (color) => {
                const isSelected =
                  form.colors.includes(color);

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      toggleColor(color)
                    }
                    className={`rounded-xl border-2 px-5 py-3 font-bold transition ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-black"
                    }`}
                  >
                    {color}
                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* IMÁGENES POR COLOR */}

        {form.colors.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow sm:p-8">

            <div>
              <h2 className="text-2xl font-black">
                Imagen para cada color
              </h2>

              <p className="mt-2 text-gray-500">
                Sube la imagen correspondiente
                a cada variante. Cuando el cliente
                seleccione un color, se mostrará
                automáticamente esta imagen.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {form.colors.map(
                (color) => {
                  const image =
                    getColorImage(color);

                  const isUploading =
                    uploadingColor === color;

                  return (
                    <div
                      key={color}
                      className="overflow-hidden rounded-2xl border border-gray-200"
                    >

                      {/* Encabezado */}

                      <div className="flex items-center justify-between border-b p-4">

                        <h3 className="font-black">
                          {color}
                        </h3>

                        {image && (
                          <button
                            type="button"
                            onClick={() =>
                              removeColorImage(
                                color
                              )
                            }
                            title={`Eliminar imagen de ${color}`}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                      </div>

                      {/* Imagen */}

                      <div className="relative aspect-square bg-gray-100">

                        {image ? (
                          <Image
                            src={image}
                            alt={`${form.name} ${color}`}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-400">

                            <ImagePlus size={36} />

                            <span className="text-sm">
                              Sin imagen para este color
                            </span>

                          </div>
                        )}

                      </div>

                      {/* Subir */}

                      <div className="p-4">

                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-center font-bold text-white transition hover:bg-red-600">

                          {isUploading ? (
                            <>
                              <Loader2
                                size={18}
                                className="animate-spin"
                              />

                              Subiendo...
                            </>
                          ) : (
                            <>
                              <ImagePlus size={18} />

                              {image
                                ? "Cambiar imagen"
                                : "Subir imagen"}
                            </>
                          )}

                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            disabled={isUploading}
                            onChange={(event) =>
                              handleColorImageUpload(
                                color,
                                event.target.files?.[0]
                              )
                            }
                            className="hidden"
                          />

                        </label>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}

        {/* OPCIONES */}

        <section className="rounded-3xl bg-white p-6 shadow sm:p-8">

          <h2 className="text-2xl font-black">
            Opciones
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <button
              type="button"
              onClick={() =>
                updateField(
                  "featured",
                  !form.featured
                )
              }
              className={`rounded-2xl border-2 p-5 text-left transition ${
                form.featured
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              <p className="font-black">
                Producto destacado
              </p>

              <p
                className={`mt-1 text-sm ${
                  form.featured
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                Mostrar en la sección de productos
                destacados.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "is_new",
                  !form.is_new
                )
              }
              className={`rounded-2xl border-2 p-5 text-left transition ${
                form.is_new
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              <p className="font-black">
                Producto nuevo
              </p>

              <p
                className={`mt-1 text-sm ${
                  form.is_new
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                Mostrar en la sección de novedades.
              </p>
            </button>

          </div>

        </section>

        {/* GUARDAR */}

        <div className="flex flex-col-reverse gap-4 pb-10 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              router.push("/admin/products")
            }
            disabled={saving}
            className="rounded-xl border border-gray-300 px-6 py-4 font-bold transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Guardando...
              </>
            ) : (
              <>
                <Save size={20} />

                Guardar cambios
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
}