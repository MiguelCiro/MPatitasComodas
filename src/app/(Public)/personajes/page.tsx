export const dynamic = "force-dynamic";
export const revalidate = 0;
import ProductList from "@/sections/ProductList/ProductList";

export default function PersonajesPage() {
  return (
    <ProductList
      title="Personajes"
      filter="Personajes"
    />
  );
}