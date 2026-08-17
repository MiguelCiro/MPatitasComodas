export type Product = {
  id: number;

  slug: string;

  name: string;

  description: string;

  price: number;

  original_price: number | null;

  stock: number;

  image: string;

  featured: boolean;

  is_new: boolean;

  sizes: number[];

  brand_id: number;

  category_id: number;

  brand: {
    id: number;
    name: string;
    logo: string;
  };

  category: {
    id: number;
    name: "Hombre" | "Mujer" | "Unisex";
  };
};