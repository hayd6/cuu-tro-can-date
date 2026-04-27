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
      <header className="sticky top-0 w-full z-50 bg-slate-50/80 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-surface-container lg:hidden">
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

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-32 lg:pt-3 lg:pb-20 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile & Stats */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Desktop Store Profile Card */}
            <section className="hidden lg:block bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary/10 flex-shrink-0">
                  <img
                    alt="Store profile"
                    className="w-full h-full object-cover"
                    src={store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-black text-emerald-900 font-headline tracking-tight">{store.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-primary animate-pulse" : "bg-outline-variant"}`}></span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isOpen ? "text-primary" : "text-on-surface-variant"}`}>
                      {isOpen ? "Đang mở xả hàng" : "Đóng cửa"}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant/80 mt-1 flex items-center gap-1 font-medium">
                    {store.address || "123 Đường Số 1, Quận 1, TP.HCM"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-98 ${
                  isOpen 
                    ? "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest" 
                    : "bg-gradient-to-r from-primary to-primary-container text-white shadow-md shadow-primary/20 hover:shadow-primary/30"
                }`}
              >
                {isOpen ? "Tạm dừng xả hàng" : "Mở xả hàng"}
              </button>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-2 gap-4">
              <Link
                href="/merchant/listings"
                className="bg-gradient-to-br from-primary to-primary-container text-white flex flex-col items-center justify-center p-4 rounded-2xl shadow-[0_12px_32px_-4px_rgba(20,27,43,0.08)] hover:shadow-lg active:scale-95 transition-all text-center"
              >
                <span className="material-symbols-outlined text-2xl mb-1">add_shopping_cart</span>
                <span className="font-bold text-sm">Đăng túi xả hàng</span>
                <span className="text-[10px] text-white/80 mt-1">Đăng món cần bán</span>
              </Link>
              <Link
                href="/merchant/scan"
                className="bg-inverse-surface text-inverse-on-surface flex flex-col items-center justify-center p-4 rounded-2xl shadow-[0_12px_32px_-4px_rgba(20,27,43,0.08)] hover:shadow-lg active:scale-95 transition-all text-center"
              >
                <span className="material-symbols-outlined text-2xl mb-1">qr_code_scanner</span>
                <span className="font-bold text-sm">Quét mã QR</span>
                <span className="text-[10px] text-inverse-on-surface/80 mt-1">Xác nhận đơn hàng</span>
              </Link>
            </section>

            {/* Today's Real Stats */}
            <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4">Chỉ số hôm nay</h2>
                <div className="grid grid-cols-3 gap-3">
                  <Link
                    href="/merchant/orders?tab=pending"
                    className="bg-surface-container-low p-3 rounded-xl text-center active:scale-95 transition-transform hover:bg-surface-container-high block"
                  >
                    <span className="block text-2xl font-extrabold text-tertiary">{stats.pendingOrders}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Chờ lấy</span>
                    <span className="block text-[9px] text-on-surface-variant/60 mt-0.5">đơn</span>
                  </Link>
                  <Link
                    href="/merchant/orders?tab=completed"
                    className="bg-surface-container-low p-3 rounded-xl text-center active:scale-95 transition-transform hover:bg-surface-container-high block"
                  >
                    <span className="block text-2xl font-extrabold text-primary">{stats.completedToday}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Xong</span>
                    <span className="block text-[9px] text-on-surface-variant/60 mt-0.5">đơn</span>
                  </Link>
                  <Link
                    href="/merchant/revenue"
                    className="bg-surface-container-low p-3 rounded-xl text-center active:scale-95 transition-transform hover:bg-surface-container-high block"
                  >
                    <span className="block text-xl font-extrabold text-on-surface">
                      {stats.revenueToday >= 1000000
                        ? `${(stats.revenueToday / 1000000).toFixed(1)}M`
                        : `${Math.round(stats.revenueToday / 1000)}K`}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Doanh thu</span>
                    <span className="block text-[9px] text-on-surface-variant/60 mt-0.5">hôm nay</span>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Active Listings & Orders */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Listings from DB */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Đang đăng bán</h2>
                <Link href="/merchant/listings" className="text-xs font-medium text-primary hover:underline">Xem tất cả</Link>
              </div>

              {activeProductsList.length === 0 ? (
                <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center opacity-60">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inventory_2</span>
                  <p className="text-sm font-medium text-on-surface-variant">Chưa có túi thực phẩm nào</p>
                  <p className="text-[10px] uppercase tracking-widest mt-1">Đăng để giảm lãng phí</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-4 lg:overflow-x-auto hide-scrollbar pb-2 lg:snap-x">
                  {activeProductsList.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="w-full lg:w-auto lg:min-w-[280px] lg:snap-start bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] border border-outline-variant/5 flex flex-col shrink-0"
                    >
                      <div className="relative h-40 w-full flex-shrink-0">
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover"
                          src={product.imageUrl || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"}
                        />
                        <div className="absolute bottom-3 right-3 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Cần cứu
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-base font-bold text-on-surface tracking-tight line-clamp-1">{product.name}</h3>
                          <div className="text-right flex-shrink-0">
                            <span className="block text-lg font-extrabold text-primary">
                              {product.discountPrice.toLocaleString("vi-VN")}đ
                            </span>
                            <span className="text-[10px] line-through text-on-surface-variant">
                              {product.originalPrice.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mt-auto">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-on-surface-variant">
                              Đã bán: {product.quantityTotal - product.quantityLeft}/{product.quantityTotal}
                            </span>
                            <span className="text-primary">
                              {Math.round(((product.quantityTotal - product.quantityLeft) / product.quantityTotal) * 100)}%
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
                          <Link href={`/merchant/products/${product.id}/edit`} className="flex-1 bg-surface-container-high text-on-surface font-bold text-xs py-3 rounded-xl hover:bg-surface-variant transition-colors active:scale-95 text-center flex items-center justify-center">
                            Sửa
                          </Link>
                          <button 
                            onClick={() => handleEndProduct(product.id)}
                            className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold text-xs py-3 rounded-xl hover:bg-tertiary-fixed-dim transition-colors active:scale-95">
                            Kết thúc
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Orders */}
            {pendingOrders.length > 0 && (
              <section className="hidden lg:block space-y-4">
                <div className="flex justify-between items-end">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                    Đơn chờ xác nhận ({pendingOrders.length})
                  </h2>
                  <Link href="/merchant/orders" className="text-xs font-medium text-primary hover:underline">Quản lý</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x">
                  {pendingOrders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="min-w-[280px] md:min-w-[320px] snap-start bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 shadow-sm flex flex-col justify-between shrink-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-on-surface text-sm">{order.orderCode}</span>
                          <p className="text-on-surface-variant text-xs mt-0.5">{order.buyer.name}</p>
                        </div>
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          Cần lấy
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          href="/merchant/scan"
                          className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-sm active:scale-98 transition-transform"
                        >
                          Xác nhận QR
                        </Link>
                        <Link
                          href="/merchant/orders"
                          className="flex-1 bg-surface-container-highest text-primary font-bold text-xs py-2.5 rounded-xl text-center active:scale-98 transition-transform"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
