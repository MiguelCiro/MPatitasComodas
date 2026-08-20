import Container from "@/components/Container/Container";
import ProductCard from "@/components/ProductCard/ProductCard";

import { getFeaturedProducts } from "@/services/product.service";
import { Product } from "@/types/product";

export default async function FeaturedProducts() {
  const products: Product[] = await getFeaturedProducts();

  return (
    <section className="bg-gray-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-center text-4xl font-black leading-none text-gray-900 sm:mb-4 sm:text-5xl">
            Productos destacados
          </h2>

          <p className="mb-9 text-center text-base text-gray-500 sm:mb-16 sm:text-lg">
            Los modelos más buscados de esta semana.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <div
              key={product.id}
              className={`
                ${index >= 1 ? "hidden md:block" : ""}
                ${index >= 2 ? "hidden lg:block" : ""}
              `}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}