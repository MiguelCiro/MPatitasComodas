export type ProductCategory =
  | "Largas Hombre"
  | "Largas Mujer"
  | "Cortas Hombre"
  | "Cortas Mujer"
  | "Antideslizantes"
  | "Ovejeras"
  | "Compresión"
  | "Personajes"
  | "Niños"
  | "Boleras";

export type ProductColorImage = {
  color: string;
  image: string;
};

export type Product = {
  id: number;

  slug: string;

  name: string;

  description: string;

  price: number;

  original_price: number | null;

  stock: number;

  image: string;

  color_images: ProductColorImage[];

  featured: boolean;

  is_new: boolean;

  colors: string[];

  category_id: number;

  category: {
    id: number;
    name: ProductCategory;
  };
};