import { supabase } from "@/lib/supabase";

// ======================================
// Subir una imagen de producto
// ======================================

export async function uploadProductImage(
  file: File
) {
  const extension =
    file.name.split(".").pop()?.toLowerCase() ||
    "webp";

  const fileName =
    `products/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${extension}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(
      "Error subiendo imagen:",
      error
    );

    throw new Error(
      error.message ||
        "No fue posible subir la imagen."
    );
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  if (!data.publicUrl) {
    throw new Error(
      "No fue posible obtener la URL pública de la imagen."
    );
  }

  return data.publicUrl;
}

// ======================================
// Subir varias imágenes
// ======================================

export async function uploadProductImages(
  files: File[]
) {
  const uploadedImages = await Promise.all(
    files.map((file) =>
      uploadProductImage(file)
    )
  );

  return uploadedImages;
}