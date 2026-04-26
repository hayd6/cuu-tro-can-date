"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReview } from "@/lib/actions/reviews";
import Link from "next/link";

interface ReviewClientProps {
  order: any;
  userId: string;
  initialReview?: any;
}

export default function ReviewClient({ order, userId, initialReview }: ReviewClientProps) {
  const router = useRouter();
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [comment, setComment] = useState(initialReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    let res;
    if (initialReview) {
      // Edit mode
      const { updateReview } = await import("@/lib/actions/reviews");
      res = await updateReview(initialReview.id, { rating, comment });
    } else {
      // Create mode
      res = await createReview({
        userId,
        storeId: order.storeId,
        rating,
        comment,
        orderId: order.id,
      });
    }

    if (res.success) {
      router.push("/orders");
      router.refresh();
    } else {
      alert(res.error || "Gửi đánh giá thất bại");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <span className="material-symbols-outlined text-outline">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold">{initialReview ? "Chỉnh sửa đánh giá" : "Đánh giá cửa hàng"}</h1>
      </div>

      {/* Store Info */}
      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl mb-8">
        <img 
          src={order.store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"} 
          className="w-16 h-16 rounded-xl object-cover"
          alt={order.store.name}
        />
        <div>
          <h2 className="font-bold text-lg">{order.store.name}</h2>
          <p className="text-sm text-on-surface-variant line-clamp-1">{order.store.address}</p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="text-center mb-8">
        <p className="font-bold text-on-surface mb-4">Mức độ hài lòng của bạn?</p>
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="p-1 transition-transform active:scale-90"
            >
              <span 
                className="material-symbols-outlined text-4xl"
                style={{ 
                  fontVariationSettings: rating >= star ? "'FILL' 1" : "'FILL' 0",
                  color: rating >= star ? "#F59E0B" : "#D1D5DB"
                }}
              >
                star
              </span>
            </button>
          ))}
        </div>
        <p className="text-sm font-semibold text-yellow-600 mt-3">
          {rating === 5 ? "Tuyệt vời!" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Không hài lòng" : "Tệ"}
        </p>
      </div>

      {/* Comment Section */}
      <div className="flex-1">
        <label className="block text-sm font-bold text-on-surface-variant mb-2 ml-1">
          Chia sẻ thêm cảm nhận (không bắt buộc)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Túi đồ giải cứu chất lượng ra sao, quán phục vụ có nhiệt tình không?..."
          className="w-full h-40 p-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none placeholder:text-outline/40"
        />
      </div>

      {/* Footer Button */}
      <div className="mt-8 pb-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              <span>Gửi đánh giá</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
