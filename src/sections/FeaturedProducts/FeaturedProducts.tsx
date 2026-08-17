import Link from "next/link";

import Container from "@/components/Container/Container";
import ProductCard from "@/components/ProductCard/ProductCard";

import { getFeaturedProducts } from "@/services/product.service";
import { Product } from "@/types/product";

export default async function FeaturedProducts() {

  const products: Product[] = await getFeaturedProducts();

  return (

    <section className="bg-gray-50 py-24">

      <Container>

        <h2 className="mb-4 text-center text-5xl font-black">

          Productos destacados

        </h2>

        <p className="mb-16 text-center text-gray-500">

          Los modelos más buscados de esta semana.

        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {products
            .slice(0, 4)
            .map((product, index) => (

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