import { supabase } from "@/lib/supabase";

import {
  Product,
  ProductColorImage,
} from "@/types/product";

const PRODUCT_SELECT = `
  *,
  category:categories(
    id,
    name
  )
`;

// ======================================
// Tipos
// ======================================

export type CreateProductInput = {
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  stock: number;
  image: string;

  color_images: ProductColorImage[];

  featured: boolean;
  is_new?: boolean;
  colors: string[];
  category_id: number;
};

export type UpdateProductInput =
  Partial<CreateProductInput>;

// ======================================
// Obtener todos los productos
// ======================================

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("id");

  if (error) {
    console.error(
      "Error obteniendo productos:",
      error
    );

    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    color_images:
      product.color_images &&
      typeof product.color_images === "object"
        ? product.color_images
        : {},
  })) as Product[];
}

// ======================================
// Productos destacados
// ======================================

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("featured", true)
    .order("id");

  if (error) {
    console.error(
      "Error obteniendo productos destacados:",
      error
    );

    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    color_images:
      product.color_images &&
      typeof product.color_images === "object"
        ? product.color_images
        : {},
  })) as Product[];
}

// ======================================
// Buscar producto por slug
// ======================================

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const cleanSlug =
    slug.trim().toLowerCase();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", cleanSlug)
    .maybeSingle();

  if (error) {
    console.error(
      "Error buscando producto por slug:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,

    colors: Array.isArray(data.colors)
      ? data.colors
      : [],

    color_images:
      data.color_images &&
      typeof data.color_images === "object"
        ? data.color_images
        : {},
  } as Product;
}

// ======================================
// Productos por categoría
// ======================================

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories!inner(
        id,
        name
      )
    `)
    .eq("category.name", category)
    .order("id");

  if (error) {
    console.error(
      "Error obteniendo productos por categoría:",
      error
    );

    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    color_images:
      product.color_images &&
      typeof product.color_images === "object"
        ? product.color_images
        : {},
  })) as Product[];
}

// ======================================
// Crear producto
// ======================================

export async function createProduct(
  product: CreateProductInput
): Promise<Product> {
  const payload = {
    slug:
      product.slug.trim().toLowerCase(),

    name:
      product.name.trim(),

    description:
      product.description.trim(),

    price:
      Number(product.price),

    original_price:
      product.original_price ?? null,

    stock:
      Number(product.stock),

    image:
      product.image,

    color_images:
      product.color_images ?? {},

    featured:
      Boolean(product.featured),

    is_new:
      Boolean(product.is_new),

    colors:
      product.colors,

    category_id:
      Number(product.category_id),
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    console.error(
      "Error de Supabase creando producto:",
      error
    );

    throw new Error(
      error.message ||
        "No se pudo insertar el producto."
    );
  }

  return {
    ...data,

    colors: Array.isArray(data.colors)
      ? data.colors
      : [],

    color_images:
      data.color_images &&
      typeof data.color_images === "object"
        ? data.color_images
        : {},
  } as Product;
}

// ======================================
// Actualizar producto
// ======================================

export async function updateProduct(
  id: number,
  product: UpdateProductInput
): Promise<Product> {
  const payload = {
    ...product,

    ...(product.slug !== undefined && {
      slug:
        product.slug.trim().toLowerCase(),
    }),

    ...(product.name !== undefined && {
      name:
        product.name.trim(),
    }),

    ...(product.description !== undefined && {
      description:
        product.description.trim(),
    }),

    ...(product.price !== undefined && {
      price:
        Number(product.price),
    }),

    ...(product.stock !== undefined && {
      stock:
        Number(product.stock),
    }),

    ...(product.category_id !== undefined && {
      category_id:
        Number(product.category_id),
    }),

    ...(product.color_images !== undefined && {
      color_images:
        product.color_images,
    }),
  };

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    console.error(
      "Error actualizando producto:",
      error
    );

    throw new Error(
      error.message ||
        "No se pudo actualizar el producto."
    );
  }

  return {
    ...data,

    colors: Array.isArray(data.colors)
      ? data.colors
      : [],

    color_images:
      data.color_images &&
      typeof data.color_images === "object"
        ? data.color_images
        : {},
  } as Product;
}

// ======================================
// Eliminar producto
// ======================================

export async function deleteProduct(
  id: number
) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Error eliminando producto:",
      error
    );

    throw new Error(
      error.message ||
        "No se pudo eliminar el producto."
    );
  }
}

// ======================================
// Productos nuevos
// ======================================

export async function getNewProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_new", true)
    .order("id");

  if (error) {
    console.error(
      "Error obteniendo productos nuevos:",
      error
    );

    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    color_images:
      product.color_images &&
      typeof product.color_images === "object"
        ? product.color_images
        : {},
  })) as Product[];
}

// ======================================
// Productos en oferta
// ======================================

// ======================================
// Productos en oferta
// ======================================

export async function getOfferProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories!inner(
        id,
        name
      )
    `)
    .eq("category.name", "Promos")
    .order("id");

  if (error) {
    console.error(
      "Error obteniendo productos en oferta:",
      error
    );

    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    color_images:
      product.color_images &&
      typeof product.color_images === "object"
        ? product.color_images
        : {},
  })) as Product[];
}