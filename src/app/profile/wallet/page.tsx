import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLinkedPayments } from "@/lib/actions/wallet";
import WalletClient from "@/components/WalletClient";

export default async function WalletConnectionsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-surface min-h-screen">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">login</span>
        <h1 className="text-xl font-bold">Vui lòng đăng nhập</h1>
        <p className="text-on-surface-variant text-sm mt-2">Bạn cần đăng nhập để quản lý các phương thức thanh toán.</p>
      </div>
    );
  }

  const payments = await getLinkedPayments(userId);

  return <WalletClient initialPayments={payments} userId={userId} />;
}
