import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import MerchantScanClient from "@/components/MerchantScanClient";
import { redirect } from "next/navigation";

export default async function MerchantScanPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  const store = await prisma.store.findUnique({
    where: { ownerId: user.id },
    select: { id: true }
  });

  if (!store) {
    redirect("/merchant/setup");
  }

  return <MerchantScanClient storeId={store.id} />;
}
