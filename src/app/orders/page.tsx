import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getOrdersByBuyer } from "@/lib/actions/orders";
import BuyerOrdersClient from "@/components/BuyerOrdersClient";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function BuyerOrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  let orders: any[] = [];
  if (userId) {
    orders = await getOrdersByBuyer(userId);
  }

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh] pb-32 font-body">


      {!userId ? (
        // Not logged in - prompt login
        <div className="flex flex-col items-center justify-center py-24 gap-6 px-8">
          <span className="material-symbols-outlined text-6xl text-outline-variant">login</span>
          <div className="text-center">
            <p className="font-bold text-on-surface text-lg">Chưa đăng nhập</p>
            <p className="text-on-surface-variant text-sm mt-1">Đăng nhập để xem lịch sử đơn hàng của bạn</p>
          </div>
          <Link
            href="/login"
            className="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-md"
          >
            Đăng nhập ngay
          </Link>
        </div>
      ) : (
        <BuyerOrdersClient orders={orders} />
      )}
    </div>
  );
}
