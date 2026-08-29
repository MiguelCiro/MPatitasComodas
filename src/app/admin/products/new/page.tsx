"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  ImagePlus,
  Trash2,
} from "lucide-react";

import {
  createProduct,
} from "@/services/product.service";

import {
  uploadProductImage,
} from "@/services/storage.service";

import {
  getCategories,
  Category,
} from "@/services/category.service";

import {
  ProductColorImage,
} from "@/types/product";

// =====================================
// COLORES DISPONIBLES
// =====================================

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

// =====================================
// GENERAR SLUG
// =====================================

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// =====================================
// PÁGINA
// =====================================

export default function NewProductPage() {
  const router = useRouter();

  // =====================================
  // ESTADOS
  // =====================================

  const [loading, setLoading] =
    useState(false);

  const [loadingOptions, setLoadingOptions] =
    useState(true);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    featured: false,
    is_new: true,
    category_id: "",
    colors: [] as string[],
  });

  // =====================================
  // IMAGEN PRINCIPAL
  // =====================================

  const [mainImageFile, setMainImageFile] =
    useState<File | null>(null);

  const [mainImagePreview, setMainImagePreview] =
    useState("");

  // =====================================
  // IMÁGENES POR COLOR
  // =====================================

  const [colorImages, setColorImages] =
    useState<ProductColorImage[]>([]);

  const [colorImageFiles, setColorImageFiles] =
    useState<Record<string, File>>({});

  const [colorImagePreviews, setColorImagePreviews] =
    useState<Record<string, string>>({});

  // =====================================
  // CARGAR CATEGORÍAS
  // =====================================

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData =
          await getCategories();

        setCategories(categoriesData);
      } catch (error) {
        console.error(
          "Error cargando categorías:",
          error
        );

        alert(
          "No se pudieron cargar las categorías."
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadCategories();
  }, []);

  // =====================================
  // CAMBIAR NOMBRE
  // =====================================

  function handleNameChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const name = e.target.value;

    setProduct((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  }

  // =====================================
  // CAMBIOS NORMALES
  // =====================================

  function handleChange(
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) {
    const {
      name,
      value,
      type,
    } = e.target;

    setProduct((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? (
              e.target as HTMLInputElement
            ).checked
          : value,
    }));
  }

  // =====================================
  // SELECCIONAR / QUITAR COLOR
  // =====================================

  function handleColorToggle(color: string) {
    setProduct((prev) => {
      const exists =
        prev.colors.includes(color);

      const newColors = exists
        ? prev.colors.filter(
            (item) => item !== color
          )
        : [
            ...prev.colors,
            color,
          ];

      return {
        ...prev,
        colors: newColors,
      };
    });

    // Si se elimina un color,
    // eliminamos también su imagen.

    setColorImages((prev) =>
      prev.filter(
        (item) => item.color !== color
      )
    );

    setColorImageFiles((prev) => {
      const updated = { ...prev };

      delete updated[color];

      return updated;
    });

    setColorImagePreviews((prev) => {
      const updated = { ...prev };

      delete updated[color];

      return updated;
    });
  }

  // =====================================
  // IMAGEN PRINCIPAL
  // =====================================

  function handleMainImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setMainImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setMainImagePreview(previewUrl);
  }

  // =====================================
  // IMAGEN DE UN COLOR
  // =====================================

  function handleColorImage(
    color: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setColorImageFiles((prev) => ({
      ...prev,
      [color]: file,
    }));

    setColorImagePreviews((prev) => ({
      ...prev,
      [color]: previewUrl,
    }));

    // Quitamos una imagen anterior
    // de ese mismo color si existe.

    setColorImages((prev) => [
      ...prev.filter(
        (item) => item.color !== color
      ),
    ]);
  }

  // =====================================
  // ELIMINAR IMAGEN DE COLOR
  // =====================================

  function removeColorImage(color: string) {
    setColorImageFiles((prev) => {
      const updated = { ...prev };

      delete updated[color];

      return updated;
    });

    setColorImagePreviews((prev) => {
      const updated = { ...prev };

      delete updated[color];

      return updated;
    });

    setColorImages((prev) =>
      prev.filter(
        (item) => item.color !== color
      )
    );
  }

  // =====================================
  // CREAR PRODUCTO
  // =====================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    // =====================================
    // EVITAR DOBLE ENVÍO
    // =====================================

    if (loading) {
      return;
    }

    // =====================================
    // VALIDACIONES
    // =====================================

    if (!product.name.trim()) {
      alert(
        "Escribe el nombre del producto."
      );

      return;
    }

    if (!product.slug.trim()) {
      alert(
        "No se pudo generar la URL del producto."
      );

      return;
    }

    if (!product.category_id) {
      alert(
        "Selecciona una categoría."
      );

      return;
    }

    if (
      !product.price ||
      Number(product.price) <= 0
    ) {
      alert(
        "Ingresa un precio válido."
      );

      return;
    }

    if (
      product.stock === "" ||
      Number(product.stock) < 0
    ) {
      alert(
        "Ingresa un stock válido."
      );

      return;
    }

    if (product.colors.length === 0) {
      alert(
        "Selecciona al menos un color."
      );

      return;
    }

    if (!mainImageFile) {
      alert(
        "Selecciona la imagen principal del producto."
      );

      return;
    }

    // =====================================
    // VALIDAR IMAGEN PARA CADA COLOR
    // =====================================

    const missingImages =
      product.colors.filter(
        (color) =>
          !colorImageFiles[color]
      );

    if (missingImages.length > 0) {
      alert(
        `Debes seleccionar una imagen para: ${missingImages.join(
          ", "
        )}`
      );

      return;
    }

    // =====================================
    // INICIAR GUARDADO
    // =====================================

    setLoading(true);

    try {
      // ===================================
      // SUBIR IMAGEN PRINCIPAL
      // ===================================

      const mainImage =
        await uploadProductImage(
          mainImageFile
        );

      // ===================================
      // SUBIR IMÁGENES DE COLORES
      // EN PARALELO
      // ===================================

      const uploadedColorImages =
        await Promise.all(
          product.colors.map(
            async (color) => {
              const file =
                colorImageFiles[color];

              if (!file) {
                return null;
              }

              const imageUrl =
                await uploadProductImage(
                  file
                );

              return {
                color,
                image: imageUrl,
              } as ProductColorImage;
            }
          )
        );

      const validColorImages =
        uploadedColorImages.filter(
          (
            image
          ): image is ProductColorImage =>
            image !== null
        );

      // ===================================
      // CREAR PRODUCTO
      // ===================================

      await createProduct({
        name:
          product.name.trim(),

        slug:
          product.slug.trim(),

        description:
          product.description.trim(),

        image:
          mainImage,

        color_images:
          validColorImages,

        price:
          Number(product.price),

        original_price:
          product.original_price.trim()
            ? Number(
                product.original_price
              )
            : null,

        stock:
          Number(product.stock),

        featured:
          product.featured,

        is_new:
          product.is_new,

        category_id:
          Number(product.category_id),

        colors:
          product.colors,
      });

      // ===================================
      // ÉXITO
      // ===================================

      alert(
        "Producto creado correctamente."
      );

      // ===================================
      // IR AL LISTADO
      // ===================================
      //
      // IMPORTANTE:
      // NO usamos router.refresh().
      // El listado ejecutará su propio
      // getProducts() al montarse.
      // ===================================

      router.push(
        "/admin/products"
      );

    } catch (error) {
      console.error(
        "Error creando producto:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido al guardar el producto.";

      alert(
        `No se pudo guardar el producto.\n\n${message}`
      );

    } finally {
      setLoading(false);
    }
  }

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="mx-auto max-w-5xl">

      {/* ============================== */}
      {/* VOLVER */}
      {/* ============================== */}

      <button
        type="button"
        onClick={() =>
          router.push(
            "/admin/products"
          )
        }
        disabled={loading}
        className="mb-8 flex items-center gap-2 font-semibold text-gray-500 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={20} />

        Volver a productos
      </button>

      {/* ============================== */}
      {/* ENCABEZADO */}
      {/* ============================== */}

      <div className="mb-10">

        <h1 className="text-4xl font-black sm:text-5xl">
          Nuevo producto
        </h1>

        <p className="mt-3 text-gray-500">
          Agrega un nuevo producto a la tienda.
        </p>

      </div>

      {/* ============================== */}
      {/* FORMULARIO */}
      {/* ============================== */}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-6 shadow sm:p-10"
      >

        {/* ============================ */}
        {/* INFORMACIÓN BÁSICA */}
        {/* ============================ */}

        <section>

          <h2 className="text-2xl font-black">
            Información del producto
          </h2>

          <p className="mt-2 text-gray-500">
            Completa los datos principales.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* Nombre */}

            <div className="md:col-span-2">

              <label
                htmlFor="name"
                className="mb-2 block font-bold"
              >
                Nombre del producto
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={product.name}
                onChange={handleNameChange}
                placeholder="Ej: Medias Nike 2/4"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
              />

            </div>

            {/* Slug */}

            <div className="md:col-span-2">

              <label
                htmlFor="slug"
                className="mb-2 block font-bold"
              >
                URL del producto
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                value={product.slug}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-black disabled:opacity-70"
              />

            </div>

            {/* Categoría */}

            <div>

              <label
                htmlFor="category_id"
                className="mb-2 block font-bold"
              >
                Categoría
              </label>

              <select
                id="category_id"
                name="category_id"
                value={product.category_id}
                onChange={handleChange}
                disabled={
                  loadingOptions ||
                  loading
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
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

            {/* Precio */}

            <div>

              <label
                htmlFor="price"
                className="mb-2 block font-bold"
              >
                Precio
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={product.price}
                onChange={handleChange}
                placeholder="7000"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
              />

            </div>

            {/* Precio original */}

            <div>

              <label
                htmlFor="original_price"
                className="mb-2 block font-bold"
              >
                Precio anterior

                <span className="ml-1 text-sm font-normal text-gray-400">
                  (opcional)
                </span>
              </label>

              <input
                id="original_price"
                name="original_price"
                type="number"
                min="0"
                value={product.original_price}
                onChange={handleChange}
                placeholder="9000"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
              />

            </div>

            {/* Stock */}

            <div>

              <label
                htmlFor="stock"
                className="mb-2 block font-bold"
              >
                Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={product.stock}
                onChange={handleChange}
                placeholder="10"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
              />

            </div>

            {/* Descripción */}

            <div className="md:col-span-2">

              <label
                htmlFor="description"
                className="mb-2 block font-bold"
              >
                Descripción
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={product.description}
                onChange={handleChange}
                placeholder="Describe el producto..."
                disabled={loading}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
              />

            </div>

          </div>

        </section>

        {/* ============================ */}
        {/* COLORES */}
        {/* ============================ */}

        <section className="mt-10 border-t border-gray-300 pt-10">

          <h2 className="text-2xl font-black">
            Colores disponibles
          </h2>

          <p className="mt-2 text-gray-500">
            Selecciona los colores disponibles para este producto.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            {AVAILABLE_COLORS.map(
              (color) => {
                const selected =
                  product.colors.includes(
                    color
                  );

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      handleColorToggle(
                        color
                      )
                    }
                    disabled={loading}
                    className={`rounded-xl border-2 px-6 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      selected
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

        {/* ============================ */}
        {/* IMAGEN PRINCIPAL */}
        {/* ============================ */}

        <section className="mt-10 border-t border-gray-300 pt-10">

          <h2 className="text-2xl font-black">
            Imagen principal
          </h2>

          <p className="mt-2 text-gray-500">
            Esta será la imagen principal del producto.
          </p>

          <div className="mt-6">

            <label
              htmlFor="main-image"
              className={`flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-6 transition ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:border-black"
              }`}
            >

              {mainImagePreview ? (

                <Image
                  src={mainImagePreview}
                  alt="Vista previa"
                  width={500}
                  height={500}
                  unoptimized
                  className="max-h-72 w-auto rounded-xl object-contain"
                />

              ) : (

                <>

                  <ImagePlus
                    size={48}
                    className="text-gray-500"
                  />

                  <span className="mt-4 font-bold">
                    Seleccionar imagen principal
                  </span>

                  <span className="mt-1 text-sm text-gray-400">
                    JPG, PNG o WEBP
                  </span>

                </>

              )}

            </label>

            <input
              id="main-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleMainImage}
              disabled={loading}
              className="hidden"
            />

          </div>

        </section>

        {/* ============================ */}
        {/* IMÁGENES POR COLOR */}
        {/* ============================ */}

        {product.colors.length > 0 && (

          <section className="mt-10 border-t border-gray-300 pt-10">

            <h2 className="text-2xl font-black">
              Imágenes por color
            </h2>

            <p className="mt-2 text-gray-500">
              Sube una imagen para cada color seleccionado. Cuando el cliente seleccione un color, la imagen cambiará automáticamente.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {product.colors.map(
                (color) => {
                  const preview =
                    colorImagePreviews[
                      color
                    ];

                  return (
                    <div
                      key={color}
                      className="rounded-2xl border border-gray-200 p-4"
                    >

                      <div className="mb-4 flex items-center justify-between gap-3">

                        <h3 className="font-black">
                          {color}
                        </h3>

                        {preview && (

                          <button
                            type="button"
                            onClick={() =>
                              removeColorImage(
                                color
                              )
                            }
                            disabled={loading}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Eliminar imagen ${color}`}
                          >
                            <Trash2 size={18} />
                          </button>

                        )}

                      </div>

                      <label
                        htmlFor={`color-image-${color}`}
                        className={`flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 transition ${
                          loading
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer hover:border-black"
                        }`}
                      >

                        {preview ? (

                          <Image
                            src={preview}
                            alt={`Vista previa ${color}`}
                            width={400}
                            height={400}
                            unoptimized
                            className="h-full w-full object-contain"
                          />

                        ) : (

                          <>

                            <ImagePlus
                              size={38}
                              className="text-gray-500"
                            />

                            <span className="mt-3 px-3 text-center text-sm font-bold">
                              Subir imagen {color}
                            </span>

                          </>

                        )}

                      </label>

                      <input
                        id={`color-image-${color}`}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) =>
                          handleColorImage(
                            color,
                            e
                          )
                        }
                        disabled={loading}
                        className="hidden"
                      />

                    </div>
                  );
                }
              )}

            </div>

          </section>

        )}

        {/* ============================ */}
        {/* OPCIONES */}
        {/* ============================ */}

        <section className="mt-10 border-t border-gray-300 pt-10">

          <h2 className="text-2xl font-black">
            Opciones
          </h2>

          <div className="mt-6 space-y-4">

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">

              <input
                name="featured"
                type="checkbox"
                checked={product.featured}
                onChange={handleChange}
                disabled={loading}
                className="h-5 w-5"
              />

              <div>

                <p className="font-bold">
                  Producto destacado
                </p>

                <p className="text-sm text-gray-500">
                  Mostrar en la sección de productos destacados.
                </p>

              </div>

            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">

              <input
                name="is_new"
                type="checkbox"
                checked={product.is_new}
                onChange={handleChange}
                disabled={loading}
                className="h-5 w-5"
              />

              <div>

                <p className="font-bold">
                  Producto nuevo
                </p>

                <p className="text-sm text-gray-500">
                  Mostrar la etiqueta de producto nuevo.
                </p>

              </div>

            </label>

          </div>

        </section>

        {/* ============================ */}
        {/* BOTONES */}
        {/* ============================ */}

        <div className="mt-10 flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/products"
              )
            }
            disabled={loading}
            className="h-14 rounded-xl border border-gray-300 px-8 font-bold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              loadingOptions
            }
            className="h-14 flex-1 rounded-xl bg-black px-8 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Guardando producto..."
              : "Guardar producto"}
          </button>

        </div>

      </form>

    </div>
  );
}