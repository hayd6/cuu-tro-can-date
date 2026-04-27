import { getProductById } from "@/lib/actions/products";
import { notFound } from "next/navigation";
import CheckoutClient from "@/components/CheckoutClient";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<{ qty?: string }>;
}) {
  const { itemId } = await params;
  const { qty } = await searchParams;
  const product = await getProductById(itemId);

  if (!product) notFound();

  const initialQuantity = qty ? parseInt(qty) : 1;

  return <CheckoutClient product={product} initialQuantity={initialQuantity} />;
}
