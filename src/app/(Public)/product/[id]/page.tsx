import { notFound } from "next/navigation";
import Image from "next/image";

import Container from "@/components/Container/Container";

import { getProductBySlug } from "@/services/product.service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: Props) {

  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {

    notFound();

  }

  return (

    <Container>

      <section className="grid gap-20 py-20 lg:grid-cols-2">

        <div className="rounded-3xl bg-gray-100 p-10">

          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={700}
            className="mx-auto object-contain"
          />

        </div>

        <div>

          <p className="font-semibold uppercase text-red-600">

            {product.brand.name}

          </p>

          <h1 className="mt-4 text-5xl font-black">

            {product.name}

          </h1>

          <p className="mt-8 text-gray-600">

            {product.description}

          </p>

          <p className="mt-8 text-4xl font-black">

            ${product.price.toLocaleString("es-CO")}

          </p>

        </div>

      </section>

    </Container>

  );

}