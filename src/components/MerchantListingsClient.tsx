"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { endProduct, deleteProduct, repostProduct } from "@/lib/actions/products";

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
  products: Product[];
};

export default function MerchantListingsClient({ store }: { store: Store }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "ended">("active");

  const now = new Date();
  
  // Active products: AVAILABLE and not expired
  const activeProducts = store.products.filter(p => 
    p.status === "AVAILABLE" && new Date(p.expiryTime) > now
  );

  // Ended products: Not AVAILABLE or expired
  const endedProducts = store.products.filter(p => 
    p.status !== "AVAILABLE" || new Date(p.expiryTime) <= now
  );

  const handleEnd = async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn kết thúc đăng bán sản phẩm này?")) return;
    const res = await endProduct(productId, store.id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Có lỗi xảy ra");
    }
  };

  const handleRepost = async (productId: string) => {
    if (!confirm("Sản phẩm sẽ được đăng bán lại thêm 24 giờ. Xác nhận?")) return;
    const res = await repostProduct(productId, store.id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Hành động này không thể hoàn tác. Xác nhận xóa?")) return;
    const res = await deleteProduct(productId, store.id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-[100dvh]">
      <header className="sticky top-0 w-full z-50 bg-slate-50/80 backdrop-blur-md flex items-center px-4 py-4 border-b border-surface-container gap-4">
        <Link href="/merchant" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-xl font-bold font-headline tracking-tight text-emerald-900">Sản phẩm của tôi</h1>
      </header>

      {/* Tabs */}
      <nav className="flex w-full bg-surface px-4 sticky top-16 z-40 border-b border-outline-variant/10">
        <div className="flex items-center w-full">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-4 text-center text-sm transition-colors ${
              activeTab === "active"
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant font-medium border-b-2 border-transparent hover:text-primary"
            }`}
          >
            Đang bán ({activeProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("ended")}
            className={`flex-1 py-4 text-center text-sm transition-colors ${
              activeTab === "ended"
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant font-medium border-b-2 border-transparent hover:text-primary"
            }`}
          >
            Kết thúc ({endedProducts.length})
          </button>
        </div>
      </nav>

      <main className="pt-6 px-4 space-y-6 max-w-2xl mx-auto pb-12">
        {activeTab === "active" ? (
          activeProducts.length === 0 ? (
            <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-60">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inventory_2</span>
              <p className="text-sm font-medium text-on-surface-variant">Không có sản phẩm nào đang bán</p>
            </div>
          ) : (
            activeProducts.map(product => (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] mb-4"
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
                      onClick={() => handleEnd(product.id)}
                      className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold text-xs py-3 rounded-lg hover:bg-tertiary-fixed-dim transition-colors active:scale-95"
                    >
                      Kết thúc
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          endedProducts.length === 0 ? (
             <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-60">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inventory_2</span>
              <p className="text-sm font-medium text-on-surface-variant">Không có sản phẩm nào đã kết thúc</p>
            </div>
          ) : (
            endedProducts.map(product => (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] mb-4"
              >
                <div className="relative h-32 w-full opacity-60 grayscale-[50%]">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover"
                    src={product.imageUrl || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"}
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-3 right-3 bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {new Date(product.expiryTime) <= now ? "Hết thời gian" : "Đã kết thúc"}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface tracking-tight opacity-80">{product.name}</h3>
                    </div>
                    <div className="text-right opacity-80">
                      <span className="block text-lg font-extrabold text-on-surface-variant">
                        {product.discountPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link 
                      href={`/merchant/products/${product.id}/edit`}
                      className="flex-1 bg-gradient-to-r from-primary to-primary-container text-white font-bold text-xs py-3 rounded-lg hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center"
                    >
                      Đăng lại
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-error/10 text-error font-bold text-xs py-3 rounded-lg hover:bg-error/20 transition-colors active:scale-95"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </main>
    </div>
  );
}
