import { getProductById } from "@/lib/actions/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { prisma } from "@/lib/prisma";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const reviews = await prisma.review.findMany({
    where: { storeId: product.storeId },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <ProductDetailClient product={product} reviews={reviews} />;
}
