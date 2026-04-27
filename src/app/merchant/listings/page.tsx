import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MerchantListingsClient from "@/components/MerchantListingsClient";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MerchantListingsPage() {
  const session = await getServerSession(authOptions);
  const DEMO_MERCHANT_EMAIL = "tiemanxanh@cuutrocandate.vn";
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
    ? await prisma.store.findUnique({ 
        where: { ownerId: effectiveUser.id }, 
        include: { 
          products: {
            orderBy: { createdAt: "desc" }
          } 
        } 
      })
    : null;

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <p className="text-on-surface-variant">Chưa có dữ liệu cửa hàng.</p>
      </div>
    );
  }

  return <MerchantListingsClient store={store} />;
}
