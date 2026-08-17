import { supabase } from "@/lib/supabase";

export type Brand = {
  id: number;
  created_at: string;
  name: string;
  logo: string | null;
};

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error obteniendo marcas:", error);
    throw error;
  }

  return data as Brand[];
}

export async function createBrand(
  name: string,
  logo: string | null = null
) {
  const { data, error } = await supabase
    .from("brands")
    .insert({
      name,
      logo,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando marca:", error);
    throw error;
  }

  return data as Brand;
}

export async function updateBrand(
  id: number,
  name: string,
  logo: string | null = null
) {
  const { data, error } = await supabase
    .from("brands")
    .update({
      name,
      logo,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando marca:", error);
    throw error;
  }

  return data as Brand;
}

export async function deleteBrand(id: number) {
  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error eliminando marca:", error);
    throw error;
  }
}