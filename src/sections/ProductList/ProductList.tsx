import Container from "@/components/Container/Container";
import ProductCard from "@/components/ProductCard/ProductCard";

import {
  getProductsByBrand,
  getProductsByCategory,
} from "@/services/product.service";

import { Product } from "@/types/product";

type Props = {
  title: string;
  filter?: string;
  products?: Product[];
};

export default async function ProductList({
  title,
  filter,
  products: providedProducts,
}: Props) {
  let products: Product[] = [];

  // Si recibimos productos directamente,
  // usamos esos productos.
  if (providedProducts) {
    products = providedProducts;
  }

  // Si no recibimos productos directamente,
  // utilizamos el filtro tradicional.
  else if (!filter) {
    products = [];
  }

  else if (
    filter === "Hombre" ||
    filter === "Mujer" ||
    filter === "Unisex"
  ) {
    products = await getProductsByCategory(filter);
  }

  else {
    products = await getProductsByBrand(filter);
  }

  return (
    <Container>

      <section className="py-20">

        <h1 className="mb-12 text-5xl font-black">
          {title}
        </h1>

        {products.length === 0 ? (

          <div className="rounded-2xl bg-gray-100 p-10 text-center">

            <p className="text-lg text-gray-500">
              No hay productos disponibles.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => (

              <ProductCard
                key={product.id}
                {...product}
              />

            ))}

          </div>

        )}

      </section>

    </Container>
  );
}