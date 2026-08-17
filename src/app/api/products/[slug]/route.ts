import { NextResponse } from "next/server";
import { getProductBySlug } from "@/services/product.service";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json(
      {
        message: "Producto no encontrado",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(product);
}