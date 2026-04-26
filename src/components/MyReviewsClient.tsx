"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteReview, updateReview } from "@/lib/actions/reviews";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
  store: {
    name: string;
    imageUrl: string | null;
  };
}

interface MyReviewsClientProps {
  initialReviews: any[];
  stats: {
    total: number;
    average: number;
  };
}

export default function MyReviewsClient({ initialReviews, stats }: MyReviewsClientProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    
    setIsDeleting(id);
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      router.refresh();
    } catch (error) {
      alert("Lỗi khi xóa đánh giá");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdate = async () => {
    if (!editingReview) return;
    
    try {
      await updateReview(editingReview.id, {
        rating: editRating,
        comment: editComment
      });
      setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, rating: editRating, comment: editComment } : r));
      setEditingReview(null);
      router.refresh();
    } catch (error) {
      alert("Lỗi khi cập nhật đánh giá");
    }
  };

  const startEdit = (review: any) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-[100dvh] pb-32">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md">
        <div className="flex items-center px-4 py-3 w-full justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="active:scale-95 duration-150 p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <h1 className="font-['Inter'] font-semibold text-lg tracking-tight text-primary">Đánh giá của tôi</h1>
          </div>
        </div>
        <div className="bg-outline-variant/20 h-[1px]"></div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Stats Section */}
        <section className="bg-surface-container-low rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Tổng đánh giá</p>
            <h2 className="text-3xl font-extrabold text-primary">{stats.total}</h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex text-primary mb-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: i < Math.floor(stats.average) ? "'FILL' 1" : "'FILL' 0" }}>
                  {i < Math.floor(stats.average) ? 'star' : (i < stats.average ? 'star_half' : 'star')}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-on-surface">Trung bình {stats.average.toFixed(1)}/5</p>
          </div>
        </section>

        {/* Review Cards List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">rate_review</span>
              <p className="text-sm font-medium">Bạn chưa có đánh giá nào</p>
            </div>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] ring-1 ring-outline-variant/10">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container">
                        <img 
                          className="w-full h-full object-cover" 
                          alt="store logo" 
                          src={review.store.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"}
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-on-surface">{review.store.name}</h3>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 text-primary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
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
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/15">
                    <button 
                      onClick={() => startEdit(review)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-primary font-medium hover:bg-primary/5 transition-colors active:scale-95 duration-150"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span className="text-sm">Chỉnh sửa</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      disabled={isDeleting === review.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-error font-medium hover:bg-error/5 transition-colors active:scale-95 duration-150 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">{isDeleting === review.id ? 'sync' : 'delete'}</span>
                      <span className="text-sm">Xóa</span>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}

          {reviews.length > 0 && (
            <div className="py-12 flex flex-col items-center justify-center opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">rate_review</span>
              <p className="text-sm font-medium">Bạn đã xem hết đánh giá rồi</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold">Chỉnh sửa đánh giá</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-on-surface-variant">Bạn thấy thế nào?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setEditRating(star)}
                      className={`text-3xl transition-transform active:scale-90 ${star <= editRating ? 'text-primary' : 'text-outline-variant'}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: star <= editRating ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nhận xét của bạn</label>
                <textarea 
                  className="w-full bg-surface-container-highest rounded-xl p-4 min-h-[120px] outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setEditingReview(null)}
                className="flex-1 py-3 rounded-xl font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdate}
                className="flex-1 py-3 rounded-xl font-bold bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
