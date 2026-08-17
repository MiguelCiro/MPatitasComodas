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

export async function getProducts(): Promise<Product[]> {

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("id");

  if (error) {
    console.error(error);
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
    console.error(error);
    return [];
  }

  return data as Product[];

}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    return [];
  }

  return data as Product[];

}

// ======================================
// Crear producto
// ======================================

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ======================================
// Actualizar producto
// ======================================

export async function updateProduct(
  id: number,
  product: Partial<Product>
) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ======================================
// Eliminar producto
// ======================================

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
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
    console.error(error);
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
    console.error(error);
    return [];
  }

  return data as Product[];
}