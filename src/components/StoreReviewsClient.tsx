"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { replyToReview } from "@/lib/actions/reviews";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  reply: string | null;
  createdAt: Date | string;
  user: {
    name: string | null;
    avatarUrl: string | null;
  };
}

interface StoreReviewsClientProps {
  initialReviews: any[];
  stats: any;
  isOwner: boolean;
}

export default function StoreReviewsClient({ initialReviews, stats, isOwner }: StoreReviewsClientProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await replyToReview(reviewId, replyText);
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, reply: replyText } : r));
      setReplyingTo(null);
      setReplyText("");
      router.refresh();
    } catch (error) {
      alert("Lỗi khi gửi phản hồi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-[100dvh] pb-32">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-4 py-3 w-full">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="active:scale-95 transition-transform duration-200 text-primary p-2 hover:bg-surface-container-high rounded-full"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-semibold tracking-tight text-lg">Đánh giá & Nhận xét</h1>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
=======
      <main className="desktop-page-shell-tight px-4 md:px-6 lg:px-6 xl:px-8 py-6 md:py-8 lg:py-8">
>>>>>>> feature/tablet
        {/* Rating Overview */}
        <section className="bg-surface-container-low rounded-2xl p-6 mb-6 shadow-sm border border-outline-variant/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold tracking-tighter">{stats.average.toFixed(1)}</span>
              <div className="flex gap-0.5 my-2 text-primary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < Math.floor(stats.average) ? "'FILL' 1" : "'FILL' 0" }}>
                    {i < Math.floor(stats.average) ? 'star' : (i < stats.average ? 'star_half' : 'star')}
                  </span>
                ))}
              </div>
              <p className="text-on-surface-variant text-sm font-medium">Dựa trên {stats.count} đánh giá</p>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <span className="w-2">{star}</span>
                  <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${stats.count > 0 ? (stats.distribution[star] / stats.count) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Chips (Mock for now) */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-widest shadow-sm">Tất cả ({stats.count})</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-xs uppercase tracking-widest">5 sao ({stats.distribution[5]})</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-xs uppercase tracking-widest">4 sao ({stats.distribution[4]})</button>
        </div>

        {/* Review List */}
        <div className="space-y-4 mt-4">
          {reviews.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">rate_review</span>
              <p className="text-sm font-medium">Chưa có đánh giá nào</p>
            </div>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="bg-white p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 overflow-hidden flex items-center justify-center">
                      <img 
                        src={review.user.avatarUrl || `https://ui-avatars.com/api/?name=${review.user.name || 'U'}&background=random`} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">{review.user.name || "Người dùng"}</h3>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  {review.comment}
                </p>

                {/* Linked Order & Products */}
                {review.order && (
                  <div className="mb-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">receipt_long</span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Đơn hàng #{review.order.orderCode}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {review.order.items.map((item: any, idx: number) => (
                        <span key={idx} className="bg-white/80 px-2.5 py-1 rounded-md text-[10px] font-semibold text-on-surface-variant shadow-sm ring-1 ring-outline-variant/10">
                          {item.quantity}x {item.product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Merchant Reply */}
                {review.reply ? (
                  <div className="bg-surface-container-low rounded-xl p-4 mt-2 border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-sm">store</span>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">Phản hồi từ cửa hàng</p>
                    </div>
                    <p className="text-sm text-on-surface italic">{review.reply}</p>
                    {isOwner && (
                      <button 
                        onClick={() => {
                          setReplyingTo(review.id);
                          setReplyText(review.reply);
                        }}
                        className="text-primary text-[10px] font-bold uppercase mt-2 hover:underline"
                      >
                        Chỉnh sửa phản hồi
                      </button>
                    )}
                  </div>
                ) : (
                  isOwner && replyingTo !== review.id && (
                    <button 
                      onClick={() => setReplyingTo(review.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors mt-2"
                    >
                      <span className="material-symbols-outlined text-sm">reply</span>
                      Phản hồi
                    </button>
                  )
                )}

                {/* Reply Input Form */}
                {replyingTo === review.id && (
                  <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <textarea 
                      className="w-full bg-surface-container-highest rounded-xl p-4 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Viết phản hồi của bạn..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="px-4 py-2 rounded-lg text-on-surface-variant font-bold text-xs uppercase"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={() => handleReply(review.id)}
                        disabled={isSubmitting || !replyText.trim()}
                        className="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-widest shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
