import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import MerchantEditProfileClient from "@/components/MerchantEditProfileClient";

export const dynamic = "force-dynamic";

export default async function MerchantEditProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.id) {
    redirect("/login");
  }

  // Get Store and Owner info
  const store = await prisma.store.findUnique({
    where: { ownerId: user.id },
    select: {
      id: true,
      name: true,
      address: true,
      imageUrl: true,
      lat: true,
      lng: true,
      owner: {
        select: {
          phone: true,
        },
      },
    },
  });

  if (!store) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface">
        <p>Không tìm thấy cửa hàng.</p>
      </div>
    );
  }

  return <MerchantEditProfileClient store={store} />;
}
