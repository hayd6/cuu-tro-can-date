"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { endProduct } from "@/lib/actions/products";

type Product = {
  id: string;
  name: string;
  imageUrl: string | null;
  discountPrice: number;
  originalPrice: number;
  quantityLeft: number;
  quantityTotal: number;
  discountPercent: number;
  status: string;
  expiryTime: Date;
};

type Store = {
  id: string;
  name: string;
  imageUrl: string | null;
  rating: number;
  isActive: boolean;
  products: Product[];
};

type Stats = {
  pendingOrders: number;
  completedToday: number;
  revenueToday: number;
  activeProducts: number;
};

type Order = {
  id: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  buyer: { id: string; name: string | null; phone: string | null };
  items: { id: string; quantity: number; product: { name: string } }[];
};

interface Props {
  store: Store | null;
  stats: Stats;
  recentOrders: Order[];
}

export default function MerchantDashboardClient({ store, stats, recentOrders }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(store?.isActive ?? true);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface gap-4">
        <span className="material-symbols-outlined text-5xl text-outline-variant">store</span>
        <p className="text-on-surface-variant font-medium">Chưa có cửa hàng</p>
        <Link
          href="/merchant/create"
          className="bg-primary text-white font-bold px-6 py-3 rounded-xl"
        >
          Tạo cửa hàng ngay
        </Link>
      </div>
    );
  }

  const pendingOrders = recentOrders.filter((o) => o.status === "CONFIRMED");

  // Determine active products (status == AVAILABLE and expiryTime > now)
  const now = new Date();
  const activeProductsList = store.products.filter(p => 
    p.status === "AVAILABLE" && new Date(p.expiryTime) > now
  );

  const handleEndProduct = async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn kết thúc đăng bán sản phẩm này?")) return;
    const res = await endProduct(productId, store.id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-[100dvh]">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-slate-50/80 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-surface-container">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary/10">
            <img
              alt="Store profile"
              className="w-full h-full object-cover"
              src={store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-900 font-headline tracking-tight">{store.name}</h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-primary animate-pulse" : "bg-outline-variant"}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isOpen ? "text-primary" : "text-on-surface-variant"}`}>
                {isOpen ? "Đang mở xả hàng" : "Đóng cửa"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${isOpen ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"} px-4 py-1.5 rounded-full font-bold text-xs tracking-tight hover:opacity-90 transition-colors active:scale-95 duration-150`}
        >
          {isOpen ? "MỞ" : "ĐÓNG"}
        </button>
      </header>

      <main className="pt-8 px-6 space-y-8 max-w-2xl mx-auto pb-12">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <Link
            href="/merchant/create"
            className="bg-gradient-to-br from-primary to-primary-container text-white flex flex-col items-center justify-center p-6 rounded-xl shadow-[0_12px_32px_-4px_rgba(20,27,43,0.08)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
            <span className="font-bold text-sm">Đăng túi xả hàng</span>
          </Link>
          <Link
            href="/merchant/scan"
            className="bg-inverse-surface text-inverse-on-surface flex flex-col items-center justify-center p-6 rounded-xl shadow-[0_12px_32px_-4px_rgba(20,27,43,0.08)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl mb-2">qr_code_scanner</span>
            <span className="font-bold text-sm">Quét mã QR</span>
          </Link>
        </section>

        {/* Today's Real Stats */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4">Chỉ số hôm nay</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link
              href="/merchant/orders?tab=pending"
              className="bg-surface-container-low p-4 rounded-xl text-center active:scale-95 transition-transform hover:bg-surface-container-high block"
            >
              <span className="block text-2xl font-extrabold text-tertiary">{stats.pendingOrders}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Chờ lấy</span>
            </Link>
            <Link
              href="/merchant/orders?tab=completed"
              className="bg-surface-container-low p-4 rounded-xl text-center active:scale-95 transition-transform hover:bg-surface-container-high block"
            >
              <span className="block text-2xl font-extrabold text-primary">{stats.completedToday}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Hoàn thành</span>
            </Link>
            <Link
              href="/merchant/revenue"
              className="bg-surface-container-low p-4 rounded-xl text-center active:scale-95 transition-transform hover:bg-surface-container-high block"
            >
              <span className="block text-xl font-extrabold text-on-surface">
                {stats.revenueToday >= 1000000
                  ? `${(stats.revenueToday / 1000000).toFixed(1)}M`
                  : `${Math.round(stats.revenueToday / 1000)}K`}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Doanh thu</span>
            </Link>
          </div>
        </section>

        {/* Active Listings from DB */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Đang đăng bán</h2>
            <Link href="/merchant/listings" className="text-xs font-medium text-primary hover:underline">Xem tất cả</Link>
          </div>

          {activeProductsList.length === 0 ? (
            <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-60">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inventory_2</span>
              <p className="text-sm font-medium text-on-surface-variant">Chưa có túi thực phẩm nào</p>
              <p className="text-[10px] uppercase tracking-widest mt-1">Đăng để giảm lãng phí</p>
            </div>
          ) : (
            activeProductsList.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)]"
              >
                <div className="relative h-32 w-full">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover"
                    src={product.imageUrl || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"}
                  />
                  <div className="absolute bottom-3 right-3 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Cận Date
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface tracking-tight">{product.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-extrabold text-primary">
                        {product.discountPrice.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-[10px] line-through text-on-surface-variant">
                        {product.originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-on-surface-variant">
                        Đã bán: {product.quantityTotal - product.quantityLeft}/{product.quantityTotal} túi
                      </span>
                      <span className="text-primary">
                        Đã cứu {Math.round(((product.quantityTotal - product.quantityLeft) / product.quantityTotal) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-container"
                        style={{
                          width: `${((product.quantityTotal - product.quantityLeft) / product.quantityTotal) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link href={`/merchant/products/${product.id}/edit`} className="flex-1 bg-surface-container-high text-on-surface font-bold text-xs py-3 rounded-lg hover:bg-surface-variant transition-colors active:scale-95 text-center flex items-center justify-center">
                      Sửa
                    </Link>
                    <button 
                      onClick={() => handleEndProduct(product.id)}
                      className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold text-xs py-3 rounded-lg hover:bg-tertiary-fixed-dim transition-colors active:scale-95">
                      Kết thúc
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Recent Orders */}
        {pendingOrders.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                Đơn chờ xác nhận ({pendingOrders.length})
              </h2>
              <Link href="/merchant/orders" className="text-xs font-medium text-primary hover:underline">Quản lý</Link>
            </div>
            {pendingOrders.slice(0, 2).map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-on-surface">{order.orderCode}</span>
                    <p className="text-on-surface-variant text-sm">{order.buyer.name}</p>
                  </div>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    Cần lấy
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href="/merchant/scan"
                    className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xs py-2.5 rounded-lg text-center"
                  >
                    Xác nhận QR
                  </Link>
                  <Link
                    href="/merchant/orders"
                    className="flex-1 bg-surface-container-highest text-primary font-bold text-xs py-2.5 rounded-lg text-center"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
