import { getStores } from "@/lib/actions/stores";
import DiscoveryClient from "@/components/DiscoveryClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

// Server Component - fetch stores from DB
export default async function DiscoveryPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user && (session.user as any).role === "MERCHANT") {
    redirect("/merchant");
  }

  const stores = await getStores();

  return <DiscoveryClient stores={stores} />;
}
