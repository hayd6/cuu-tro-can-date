import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getMerchantStats } from "@/lib/actions/stores";
import MerchantProfileClient from "@/components/MerchantProfileClient";

export const dynamic = "force-dynamic";

export default async function MerchantProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.id) {
    redirect("/login");
  }

  // Lấy dữ liệu Store và User
  const store = await prisma.store.findUnique({
    where: { ownerId: user.id },
    include: {
      owner: {
        select: {
          phone: true,
        },
      },
    },
  });

  if (!store) {
    // Nếu Merchant chưa có Store, tự động tạo hoặc thông báo lỗi
    // Ở đây ta redirect về tạo trang hoặc xử lý tuỳ ý
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <p>Không tìm thấy cửa hàng. Vui lòng liên hệ Admin.</p>
      </div>
    );
  }

  // Lấy thống kê
  const stats = await getMerchantStats(store.id);

  return <MerchantProfileClient store={store} stats={stats} />;
}
