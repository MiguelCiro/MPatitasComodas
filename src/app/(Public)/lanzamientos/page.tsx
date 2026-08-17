import ProductList from "@/sections/ProductList/ProductList";
import { getNewProducts } from "@/services/product.service";

export default async function LanzamientosPage() {
  const products = await getNewProducts();

  return (
    <ProductList
      title="Lanzamientos"
      products={products}
    />
  );
}