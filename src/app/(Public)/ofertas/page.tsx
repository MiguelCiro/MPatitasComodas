import ProductList from "@/sections/ProductList/ProductList";
import { getOfferProducts } from "@/services/product.service";

export default async function OfertasPage() {
  const products = await getOfferProducts();

  return (
    <ProductList
      title="Ofertas"
      products={products}
    />
  );
}