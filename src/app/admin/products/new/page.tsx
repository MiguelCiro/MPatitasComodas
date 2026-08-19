"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ImagePlus } from "lucide-react";

import { createProduct } from "@/services/product.service";
import { uploadProductImage } from "@/services/storage.service";
import { getBrands, Brand } from "@/services/brand.service";
import {
  getCategories,
  Category,
} from "@/services/category.service";

const AVAILABLE_SIZES = [
  36, 37, 38, 39, 40, 41, 42, 43, 44,
];

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    price: "",
    stock: "",
    featured: false,
    brand_id: "",
    category_id: "",
    sizes: [] as number[],
  });

  useEffect(() => {
    async function loadOptions() {
      try {
        const [brandsData, categoriesData] =
          await Promise.all([
            getBrands(),
            getCategories(),
          ]);

        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

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

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  function handleSizeToggle(size: number) {
    setProduct((prev) => {
      const exists = prev.sizes.includes(size);

      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((item) => item !== size)
          : [...prev.sizes, size].sort((a, b) => a - b),
      };
    });
  }

  function handleImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

 async function handleSubmit(
      e: React.FormEvent
    ) {
      e.preventDefault();

      if (!product.name.trim()) {
        alert("Escribe el nombre del producto.");
        return;
      }

      if (!product.slug.trim()) {
        alert(
          "No se pudo generar la URL del producto."
        );
        return;
      }

      if (!product.brand_id) {
        alert("Selecciona una marca.");
        return;
      }

      if (!product.category_id) {
        alert("Selecciona una categoría.");
        return;
      }

      if (
        product.price === "" ||
        Number(product.price) <= 0
      ) {
        alert("Ingresa un precio válido.");
        return;
      }

      if (
        product.stock === "" ||
        Number(product.stock) < 0
      ) {
        alert("Ingresa un stock válido.");
        return;
      }

      if (product.sizes.length === 0) {
        alert("Selecciona al menos una talla.");
        return;
      }

      if (!imageFile && !product.image.trim()) {
        alert("Selecciona una imagen para el producto.");
        return;
      }

      setLoading(true);

      try {
        let imageUrl = product.image.trim();

        // ================================
        // SUBIR IMAGEN
        // ================================

        if (imageFile) {
          try {
            imageUrl = await uploadProductImage(
              imageFile
            );
          } catch (error) {
            console.error(
              "Error subiendo imagen:",
              error
            );

            const message =
              error instanceof Error
                ? error.message
                : "Error desconocido al subir la imagen.";

            alert(
              `No se pudo subir la imagen.\n\n${message}`
            );

            return;
          }
        }

        // ================================
        // CREAR PRODUCTO
        // ================================

        try {
          await createProduct({
            name: product.name.trim(),
            slug: product.slug.trim(),
            description: product.description.trim(),
            image: imageUrl,
            price: Number(product.price),
            original_price: null,
            stock: Number(product.stock),
            featured: product.featured,
            is_new: false,
            brand_id: Number(product.brand_id),
            category_id: Number(product.category_id),
            sizes: product.sizes,
          });
        } catch (error) {
          console.error(
            "Error insertando producto:",
            error
          );

          const message =
            error instanceof Error
              ? error.message
              : "Error desconocido al guardar el producto.";

          alert(
            `No se pudo guardar el producto.\n\n${message}`
          );

          return;
        }

        alert("Producto creado correctamente.");

        router.push("/admin/products");
        router.refresh();
      } finally {
        setLoading(false);
      }
    }

  if (loadingOptions) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold text-gray-500">
          Cargando información...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">

      <button
        type="button"
        onClick={() => router.push("/admin/products")}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
      >
        <ArrowLeft size={18} />
        Volver a productos
      </button>

      <div className="mb-8">
        <h1 className="text-5xl font-black">
          Nuevo producto
        </h1>

        <p className="mt-2 text-gray-500">
          Agrega un nuevo producto al catálogo de la tienda.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl bg-white p-8 shadow"
      >

        {/* Información básica */}

        <section>
          <h2 className="mb-5 text-2xl font-bold">
            Información del producto
          </h2>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Nombre del producto
              </label>

              <input
                name="name"
                value={product.name}
                placeholder="Ej: Nike Air Max 90"
                onChange={handleNameChange}
                className="w-full rounded-xl border p-4 outline-none transition focus:border-black"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Marca
                </label>

                <select
                  name="brand_id"
                  value={product.brand_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-4 outline-none focus:border-black"
                  required
                >
                  <option value="">
                    Selecciona una marca
                  </option>

                  {brands.map((brand) => (
                    <option
                      key={brand.id}
                      value={brand.id}
                    >
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Categoría
                </label>

                <select
                  name="category_id"
                  value={product.category_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-4 outline-none focus:border-black"
                  required
                >
                  <option value="">
                    Selecciona una categoría
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Descripción
              </label>

              <textarea
                name="description"
                value={product.description}
                placeholder="Describe el producto..."
                rows={5}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border p-4 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                URL del producto
              </label>

              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                /producto/{product.slug || "nombre-del-producto"}
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Se genera automáticamente a partir del nombre.
              </p>
            </div>

          </div>
        </section>

        {/* Precio e inventario */}

        <section className="border-t pt-8">

          <h2 className="mb-5 text-2xl font-bold">
            Precio e inventario
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Precio
              </label>

              <input
                type="number"
                name="price"
                value={product.price}
                placeholder="Ej: 650000"
                min="0"
                onChange={handleChange}
                className="w-full rounded-xl border p-4 outline-none focus:border-black"
                required
              />

              <p className="mt-2 text-xs text-gray-400">
                Ingresa el precio en pesos colombianos.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Stock disponible
              </label>

              <input
                type="number"
                name="stock"
                value={product.stock}
                placeholder="Ej: 10"
                min="0"
                onChange={handleChange}
                className="w-full rounded-xl border p-4 outline-none focus:border-black"
                required
              />
            </div>

          </div>

        </section>

        {/* Tallas */}

        <section className="border-t pt-8">

          <h2 className="mb-2 text-2xl font-bold">
            Tallas disponibles
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Selecciona las tallas que el cliente podrá elegir.
          </p>

          <div className="flex flex-wrap gap-3">

            {AVAILABLE_SIZES.map((size) => {
              const selected =
                product.sizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`flex h-12 w-14 items-center justify-center rounded-xl border font-bold transition ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}

          </div>

        </section>

        {/* Imagen */}

        <section className="border-t pt-8">

          <h2 className="mb-2 text-2xl font-bold">
            Imagen del producto
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Sube una imagen clara y de buena calidad.
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 transition hover:border-black">

            <ImagePlus size={40} />

            <span className="mt-3 font-semibold">
              Seleccionar imagen
            </span>

            <span className="mt-1 text-sm text-gray-400">
              JPG, PNG o WEBP
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImage}
              className="hidden"
            />

          </label>

          {preview && (
            <div className="relative mt-5 h-72 w-full overflow-hidden rounded-2xl border bg-gray-50">

              <Image
                src={preview}
                alt="Vista previa del producto"
                fill
                className="object-contain"
              />

            </div>
          )}

        </section>

        {/* Opciones */}

        <section className="border-t pt-8">

          <label className="flex cursor-pointer items-center gap-3">

            <input
              type="checkbox"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
              className="h-5 w-5"
            />

            <div>
              <p className="font-semibold">
                Producto destacado
              </p>

              <p className="text-sm text-gray-500">
                Mostrar este producto en las secciones destacadas de la tienda.
              </p>
            </div>

          </label>

        </section>

        {/* Botones */}

        <div className="flex flex-col-reverse gap-3 border-t pt-8 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-xl border border-gray-200 px-8 py-4 font-bold transition hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-8 py-4 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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