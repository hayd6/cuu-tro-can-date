import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getStoreByOwner, getMerchantStats } from "@/lib/actions/stores";
import { getOrdersByStore } from "@/lib/actions/orders";
import MerchantDashboardClient from "@/components/MerchantDashboardClient";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

// For demo, use seeded merchant email
// In production, this would come from session
const DEMO_MERCHANT_EMAIL = "tiemanxanh@cuutrocandate.vn";

export default async function MerchantDashboard() {
  const session = await getServerSession(authOptions);
  // Use session userId if merchant, else fall back to demo store lookup
  const userEmail = session?.user?.email || DEMO_MERCHANT_EMAIL;

  // Get the store from DB by the merchant user's email
  const { prisma } = await import("@/lib/prisma");
  const merchantUser = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, name: true, role: true },
  });

  // Fallback to demo merchant if current session user is not a merchant
  const effectiveEmail =
    merchantUser?.role === "MERCHANT" ? userEmail : DEMO_MERCHANT_EMAIL;
  const effectiveMerchant = merchantUser?.role === "MERCHANT"
    ? merchantUser
    : await prisma.user.findUnique({ where: { email: DEMO_MERCHANT_EMAIL }, select: { id: true, name: true, role: true } });

  if (!effectiveMerchant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <p className="text-on-surface-variant">Chưa có dữ liệu cửa hàng.</p>
      </div>
    );
  }

  const [store, stats, recentOrders] = await Promise.all([
    getStoreByOwner(effectiveMerchant.id),
    prisma.store
      .findUnique({ where: { ownerId: effectiveMerchant.id }, select: { id: true } })
      .then((s) => (s ? getMerchantStats(s.id) : { pendingOrders: 0, completedToday: 0, revenueToday: 0, activeProducts: 0 })),
    prisma.store
      .findUnique({ where: { ownerId: effectiveMerchant.id }, select: { id: true } })
      .then((s) => (s ? getOrdersByStore(s.id) : [])),
  ]);

  return <MerchantDashboardClient store={store} stats={stats} recentOrders={recentOrders} />;
}
