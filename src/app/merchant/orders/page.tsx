import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getOrdersByStore } from "@/lib/actions/orders";
import { getStoreByOwner } from "@/lib/actions/stores";
import MerchantOrdersClient from "@/components/MerchantOrdersClient";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

const DEMO_MERCHANT_EMAIL = "tiemanxanh@cuutrocandate.vn";

export default async function MerchantOrdersPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || DEMO_MERCHANT_EMAIL;

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, role: true },
  });

  const effectiveEmail = user?.role === "MERCHANT" ? userEmail : DEMO_MERCHANT_EMAIL;
  const effectiveUser = user?.role === "MERCHANT"
    ? user
    : await prisma.user.findUnique({ where: { email: DEMO_MERCHANT_EMAIL }, select: { id: true } });

  const store = effectiveUser
    ? await prisma.store.findUnique({ where: { ownerId: effectiveUser.id }, select: { id: true } })
    : null;

  const orders = store ? await getOrdersByStore(store.id) : [];

  return <MerchantOrdersClient orders={orders} storeId={store?.id || ""} />;
}
