import { getProducts } from "@/services/product.service";

export default async function TestPage() {

  const products = await getProducts();

  return (

    <pre>

      {JSON.stringify(products, null, 2)}

    </pre>

  );

}