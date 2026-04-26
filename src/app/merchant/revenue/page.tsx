import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMerchantStats, getMerchantWalletData } from "@/lib/actions/stores";
import MerchantWalletClient from "@/components/MerchantWalletClient";

export default async function MerchantRevenuePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.id) {
    redirect("/login");
  }

  const store = await prisma.store.findUnique({
    where: { ownerId: user.id },
    select: { id: true },
  });

  if (!store) {
    redirect("/merchant/create");
  }

  const stats = await getMerchantStats(store.id);
  const history = await getMerchantWalletData(store.id);

  return (
    <MerchantWalletClient 
      balance={stats.totalBalance} 
      history={history} 
      stats={{
        monthlyRevenue: stats.monthlyRevenue,
        completedOrders: stats.lifetimeCompletedOrders,
        avgOrderValue: stats.avgOrderValue,
        growth: stats.growth,
      }} 
      chartData={stats.chartData}
    />
  );
}
