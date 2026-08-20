import Container from "@/components/Container/Container";
import ProductCard from "@/components/ProductCard/ProductCard";

import { getProducts } from "@/services/product.service";
import { Product } from "@/types/product";

export default async function UnisexPage() {
  const products: Product[] = await getProducts();

  const unisexProducts = products.filter(
    (product) => product.category === "Unisex"
  );

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <Container>
        {/* ENCABEZADO */}

        <div className="mb-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[4px] text-red-600">
            KickDistrict
          </p>

          <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Sneakers Unisex
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            Modelos versátiles para todos los estilos. Descubre nuestra
            selección de sneakers unisex.
          </p>
        </div>

        {/* PRODUCTOS */}

        {unisexProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {unisexProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 text-center">
            <h2 className="text-2xl font-black text-gray-900">
              Próximamente
            </h2>

            <p className="mt-3 max-w-md text-gray-500">
              Estamos preparando nuevos modelos unisex para KickDistrict.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}