"use client";

import { useRouter } from "next/navigation";

export default function MerchantReviewsClient({ reviews }: { reviews: any[] }) {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold">Khách hàng đánh giá</h1>
      </header>

      <div className="p-4 space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-surface-container-low rounded-3xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">rate_review</span>
            <p className="text-on-surface-variant font-medium">Chưa có đánh giá nào</p>
          </div>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="bg-white rounded-3xl p-5 shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {review.user.avatarUrl ? (
                      <img src={review.user.avatarUrl} className="w-full h-full object-cover rounded-full" alt="" />
                    ) : (
                      <span className="font-bold text-primary">{review.user.name?.[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{review.user.name}</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-xs" style={{ color: review.rating >= s ? "#F59E0B" : "#D1D5DB", fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-on-surface-variant">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              
              <p className="text-sm text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl italic">
                "{review.comment || "Khách hàng không để lại bình luận."}"
              </p>

              {review.reply && (
                <div className="mt-4 pl-4 border-l-2 border-primary/20">
                  <p className="text-[10px] font-black text-primary uppercase mb-1">Bạn đã phản hồi:</p>
                  <p className="text-xs text-on-surface/70 leading-relaxed">{review.reply}</p>
                </div>
              )}

              {!review.reply && (
                <button className="mt-4 w-full py-2 bg-surface-container-high text-primary font-bold text-[10px] rounded-lg uppercase tracking-wider hover:bg-primary/5 transition-colors">
                  Phản hồi khách hàng
                </button>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
