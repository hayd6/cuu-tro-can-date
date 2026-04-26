import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getProductById } from "@/lib/actions/products";
import EditProductClient from "@/components/EditProductClient";

export default async function EditProductPage({ params }: { params: { id: string } }) {
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
    ? await prisma.store.findUnique({ where: { ownerId: effectiveUser.id } })
    : null;

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <p className="text-on-surface-variant">Chưa có dữ liệu cửa hàng.</p>
      </div>
    );
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <p className="text-on-surface-variant">Mã sản phẩm không hợp lệ.</p>
      </div>
    );
  }

  const product = await getProductById(resolvedParams.id);

  if (!product || product.storeId !== store.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <p className="text-on-surface-variant">Không tìm thấy sản phẩm, hoặc bạn không có quyền sửa.</p>
      </div>
    );
  }

  return <EditProductClient product={product} storeId={store.id} />;
}
