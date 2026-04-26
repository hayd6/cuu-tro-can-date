import Link from "next/link";
import { getProducts } from "@/lib/actions/products";
import ListClient from "@/components/ListClient";

export const dynamic = 'force-dynamic';

// Server Component
export default async function DiscoveryListPage() {
  const products = await getProducts();

  return <ListClient initialProducts={products} />;
}
