import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

const PRODUCT_SELECT = `
  *,
  brand:brands(
    id,
    name,
    logo
  ),
  category:categories(
    id,
    name
  )
`;

export type CreateProductInput = {
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  stock: number;
  image: string;
  featured: boolean;
  is_new?: boolean;
  sizes: number[];
  brand_id: number;
  category_id: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("id");

  if (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }

  return data as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("featured", true)
    .order("id");

  if (error) {
    console.error("Error obteniendo productos destacados:", error);
    return [];
  }

  return data as Product[];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const cleanSlug = slug.trim().toLowerCase();

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

  return data as Product;
}

export async function getProductsByBrand(
  brand: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands!inner(
        id,
        name,
        logo
      ),
      category:categories(
        id,
        name
      )
    `)
    .eq("brand.name", brand)
    .order("id");

  if (error) {
    console.error(
      "Error obteniendo productos por marca:",
      error
    );

    return [];
  }

  return data as Product[];
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands(
        id,
        name,
        logo
      ),
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

  return data as Product[];
}

// ======================================
// Crear producto
// ======================================

export async function createProduct(
  product: CreateProductInput
): Promise<Product> {
  const payload = {
    slug: product.slug.trim().toLowerCase(),
    name: product.name.trim(),
    description: product.description.trim(),
    price: Number(product.price),
    original_price: product.original_price ?? null,
    stock: Number(product.stock),
    image: product.image,
    featured: Boolean(product.featured),
    is_new: Boolean(product.is_new),
    sizes: product.sizes,
    brand_id: Number(product.brand_id),
    category_id: Number(product.category_id),
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
        "No se pudo insertar el producto en la base de datos."
    );
  }

  return data as Product;
}

// ======================================
// Actualizar producto
// ======================================

export async function updateProduct(
  id: number,
  product: UpdateProductInput
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(product)
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

  return data as Product;
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
// Productos nuevos / lanzamientos
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

  return data as Product[];
}

// ======================================
// Productos en oferta
// ======================================

export async function getOfferProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .not("original_price", "is", null)
    .order("id");

  if (error) {
    console.error(
      "Error obteniendo productos en oferta:",
      error
    );

    return [];
  }

  return data as Product[];
}