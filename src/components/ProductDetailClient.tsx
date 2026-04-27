"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  quantityLeft: number;
  expiryTime: Date;
  pickupStart: Date | null;
  pickupEnd: Date | null;
  store: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
    rating: number;
    lat: number;
    lng: number;
  };
};

export default function ProductDetailClient({ product, reviews }: { product: Product, reviews: any[] }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);

  // External Map Redirect
  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${product.store.lat},${product.store.lng}`;
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Giải cứu ngay: ${product.name} tại ${product.store.name} với giá chỉ ${product.discountPrice.toLocaleString('vi-VN')}đ!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Đã sao chép liên kết vào bộ nhớ tạm!");
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  useEffect(() => {
    const diff = Math.max(
      0,
      Math.floor(
        (new Date(product.expiryTime).getTime() - Date.now()) / 1000
      )
    );
    setTimeLeft(diff);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [product.expiryTime]);

  const formatDetailedTime = (seconds: number) => {
    if (seconds <= 0) return "Đã hết hạn";
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (d > 0) return `Còn ${d} ngày ${h}h`;
    if (h > 0) return `Còn ${h}h ${m}p`;
    return `Còn ${m}p ${s}s`;
  };

  const pickupLabel = product.pickupStart && product.pickupEnd
    ? `${new Date(product.pickupStart).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(product.pickupEnd).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} hôm nay`
    : "Theo giờ cửa hàng";

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">

          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-slate-600">arrow_back</span>
          </button>
          <h1 className="font-['Inter'] font-semibold text-lg tracking-tight text-slate-600">Chi tiết túi mù</h1>
          <button 
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-slate-600">share</span>
          </button>
        </div>
      </header>

      <main className="pb-32 lg:pb-12 lg:pt-8 px-0 lg:px-8 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Image, Description, Reviews */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Area */}
            <section className="relative aspect-[16/9] w-full overflow-hidden bg-surface-container-highest lg:rounded-3xl lg:shadow-md">
              <img
                alt={product.name}
                className="w-full h-full object-cover"
                src={product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"}
              />
              <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary px-3 py-1.5 rounded-lg font-bold text-sm tracking-wider shadow-lg">
                GIẢM {product.discountPercent}%
              </div>
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-[12px] px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20">
                <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                <span className="text-tertiary font-bold text-sm">{formatDetailedTime(timeLeft)}</span>
              </div>
            </section>

            {/* Description & Details (Desktop) */}
            <div className="hidden lg:block bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] border border-outline-variant/10">
              <section>
                <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Mô tả sản phẩm</h4>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  {product.description || "Mô tả đang được cập nhật..."}
                </p>
              </section>

              {/* Reviews Section */}
              <section className="pt-6 mt-6 border-t border-outline-variant/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Đánh giá cộng đồng</h4>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold">{product.store.rating}</span>
                  </div>
                </div>
                
                {reviews.length === 0 ? (
                  <div className="bg-surface-container-low rounded-2xl p-6 text-center">
                    <p className="text-xs text-on-surface-variant/60 italic">Chưa có đánh giá nào cho cửa hàng này. Hãy là người đầu tiên cứu trợ và chia sẻ cảm nhận nhé!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="bg-surface-container-low rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              {review.user.avatarUrl ? (
                                <img src={review.user.avatarUrl} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <span className="text-[10px] font-bold text-primary">{review.user.name?.[0].toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{review.user.name}</p>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span key={s} className="material-symbols-outlined text-[10px]" style={{ color: review.rating >= s ? "#F59E0B" : "#D1D5DB", fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-on-surface-variant opacity-60">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{review.comment}</p>
                        
                        {review.order && (
                          <div className="mt-2 flex items-center gap-1 opacity-50">
                            <span className="material-symbols-outlined text-[10px]">receipt_long</span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">Đơn #{review.order.orderCode}</span>
                          </div>
                        )}
                        
                        {review.reply && (
                          <div className="mt-3 bg-white/50 rounded-xl p-3 border-l-2 border-primary/30">
                            <p className="text-[10px] font-bold text-primary uppercase mb-1">Phản hồi từ chủ quán:</p>
                            <p className="text-[11px] text-on-surface/80 italic">"{review.reply}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {reviews.length > 3 && (
                      <button className="w-full py-2 text-primary font-bold text-[10px] border border-primary/20 rounded-xl uppercase tracking-widest">
                        Xem tất cả {reviews.length} đánh giá
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Right Column: Store Info & Purchase Actions */}
          <div className="lg:col-span-5 px-5 lg:px-0 -mt-6 lg:mt-0 relative z-10 lg:z-0 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] border border-outline-variant/10">
              {/* Title & Price */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold tracking-tight text-on-surface leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Chỉ còn {product.quantityLeft} phần
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-primary">
                  {product.discountPrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-on-surface-variant line-through text-sm">
                  {product.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* O2O Section */}
              <div className="mt-8 space-y-4">
                <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Giờ lấy hàng</p>
                    <p className="font-bold text-on-surface">{pickupLabel}</p>
                  </div>
                </div>

                <div className="space-y-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0">
                      <img
                        alt={product.store.name}
                        className="w-full h-full object-cover"
                        src={product.store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-on-surface">{product.store.name}</h3>
                      <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">{product.store.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/store/${product.store.id}/reviews`}
                      className="flex items-center gap-1 text-xs text-on-surface-variant hover:bg-surface-container-high px-2 py-1 rounded-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-on-surface">{product.store.rating}</span>
                      <span className="text-[10px] ml-1 opacity-70">(Xem đánh giá)</span>
                    </Link>
                    <button 
                      onClick={openDirections}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">map</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Bản đồ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Action for Desktop */}
            <div className="hidden lg:block bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] border border-outline-variant/10">
              <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Mua hàng</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-on-surface-variant font-medium">Số lượng:</span>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1">
                  <button
                    onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-primary transition-colors active:scale-95 bg-white rounded-xl shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  <span className="w-6 text-center font-bold text-slate-700 text-sm">{quantity}</span>
                  <button
                    onClick={() => quantity < product.quantityLeft && setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white transition-colors active:scale-95 bg-primary rounded-xl shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-on-surface-variant font-medium">Tổng tiền:</span>
                <span className="text-2xl font-extrabold text-primary">
                  {(product.discountPrice * quantity).toLocaleString("vi-VN")}đ
                </span>
              </div>
              <Link
                href={`/checkout/${product.id}?qty=${quantity}`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-2xl py-3 px-4 font-bold tracking-tight active:scale-[0.98] transition-all shadow-md text-center"
              >
                <span className="text-[13px] uppercase">CỨU NGAY</span>
              </Link>
            </div>

            {/* Description & Details (Mobile) */}
            <div className="lg:hidden space-y-6 mt-6 bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] border border-outline-variant/10">
              <section>
                <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Mô tả sản phẩm</h4>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  {product.description || "Mô tả đang được cập nhật..."}
                </p>
              </section>

              {/* Reviews Section */}
              <section className="pt-4 border-t border-outline-variant/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Đánh giá cộng đồng</h4>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold">{product.store.rating}</span>
                  </div>
                </div>
                
                {reviews.length === 0 ? (
                  <div className="bg-surface-container-low rounded-2xl p-6 text-center">
                    <p className="text-xs text-on-surface-variant/60 italic">Chưa có đánh giá nào cho cửa hàng này. Hãy là người đầu tiên cứu trợ và chia sẻ cảm nhận nhé!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="bg-surface-container-low rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              {review.user.avatarUrl ? (
                                <img src={review.user.avatarUrl} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <span className="text-[10px] font-bold text-primary">{review.user.name?.[0].toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{review.user.name}</p>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span key={s} className="material-symbols-outlined text-[10px]" style={{ color: review.rating >= s ? "#F59E0B" : "#D1D5DB", fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-on-surface-variant opacity-60">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{review.comment}</p>
                        
                        {review.order && (
                          <div className="mt-2 flex items-center gap-1 opacity-50">
                            <span className="material-symbols-outlined text-[10px]">receipt_long</span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">Đơn #{review.order.orderCode}</span>
                          </div>
                        )}
                        
                        {review.reply && (
                          <div className="mt-3 bg-white/50 rounded-xl p-3 border-l-2 border-primary/30">
                            <p className="text-[10px] font-bold text-primary uppercase mb-1">Phản hồi từ chủ quán:</p>
                            <p className="text-[11px] text-on-surface/80 italic">"{review.reply}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {reviews.length > 3 && (
                      <button className="w-full py-2 text-primary font-bold text-[10px] border border-primary/20 rounded-xl uppercase tracking-widest">
                        Xem tất cả {reviews.length} đánh giá
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-[0_-8px_24px_-4px_rgba(20,27,43,0.06)] px-5 py-3 pb-6 flex items-center gap-3 lg:hidden">

        {/* Quantity Selector */}
        <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-primary transition-colors active:scale-95 bg-white rounded-xl shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
          <span className="w-6 text-center font-bold text-slate-700 text-sm">{quantity}</span>
          <button
            onClick={() => quantity < product.quantityLeft && setQuantity((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center text-white transition-colors active:scale-95 bg-primary rounded-xl shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>

        {/* Main CTA Button */}
        <Link
          href={`/checkout/${product.id}?qty=${quantity}`}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-2xl py-3 px-4 font-bold tracking-tight active:scale-[0.98] transition-all shadow-md"
        >
          <span className="text-[13px] uppercase">
            CỨU NGAY • {(product.discountPrice * quantity).toLocaleString("vi-VN")}đ
          </span>
        </Link>

        {/* Secondary Chat Action */}
        <Link 
          href="/coming-soon"
          className="w-11 h-11 flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-xl">chat</span>
          <span className="font-['Inter'] text-[8px] font-bold uppercase tracking-widest mt-0.5">Chat</span>
        </Link>
      </nav>
    </div>
  );
}
