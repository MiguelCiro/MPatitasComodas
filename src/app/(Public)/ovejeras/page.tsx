export const dynamic = "force-dynamic";
export const revalidate = 0;

import ProductList from "@/sections/ProductList/ProductList";

export default function OvejerasPage() {
  return (
    <ProductList
      title="Ovejeras"
      filter="Ovejeras"
    />
  );
}