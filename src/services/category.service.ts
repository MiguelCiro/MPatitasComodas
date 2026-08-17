import { supabase } from "@/lib/supabase";

export type Category = {
  id: number;
  created_at: string;
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error obteniendo categorías:", error);
    throw error;
  }

  return data as Category[];
}

export async function createCategory(name: string) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando categoría:", error);
    throw error;
  }

  return data as Category;
}

export async function updateCategory(
  id: number,
  name: string
) {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Error actualizando categoría:",
      error
    );
    throw error;
  }

  return data as Category;
}

export async function deleteCategory(id: number) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Error eliminando categoría:",
      error
    );
    throw error;
  }
}