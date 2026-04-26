"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Buyer: Gửi đánh giá cho cửa hàng
 */
export async function createReview(data: {
  userId: string;
  storeId: string;
  rating: number;
  comment?: string;
  orderId?: string; // Optional: mark order as reviewed?
}) {
  try {
    const review = await prisma.review.create({
      data: {
        userId: data.userId,
        storeId: data.storeId,
        rating: data.rating,
        comment: data.comment,
        orderId: data.orderId,
      },
    });

    // Update store rating (simple average)
    const storeReviews = await prisma.review.findMany({
      where: { storeId: data.storeId },
      select: { rating: true }
    });
    
    const avgRating = storeReviews.reduce((acc, curr) => acc + curr.rating, 0) / storeReviews.length;
    
    await prisma.store.update({
      where: { id: data.storeId },
      data: { rating: parseFloat(avgRating.toFixed(1)) }
    });

    revalidatePath("/orders");
    revalidatePath(`/product/`); // ideally would revalidate specific products if needed
    
    return { success: true, review };
  } catch (error: any) {
    return { success: false, error: error.message || "Không thể gửi đánh giá" };
  }
}

/**
 * Merchant: Trả lời đánh giá
 */
export async function replyToReview(reviewId: string, reply: string) {
  try {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { reply }
    });
    return { success: true, review };
  } catch (error: any) {
    return { success: false, error: error.message || "Không thể trả lời đánh giá" };
  }
}

/**
 * Lấy danh sách đánh giá của một cửa hàng
 */
export async function getStoreReviews(storeId: string) {
  return await prisma.review.findMany({
    where: { storeId },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true
        }
      },
      order: {
        include: {
          items: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * Cập nhật đánh giá (dành cho Buyer sửa lại)
 */
export async function updateReview(reviewId: string, data: { rating: number, comment?: string }) {
  try {
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment
      }
    });

    // Recalculate store rating
    const review = await prisma.review.findUnique({ where: { id: reviewId }, select: { storeId: true } });
    if (review) {
      const storeReviews = await prisma.review.findMany({
        where: { storeId: review.storeId },
        select: { rating: true }
      });
      const avgRating = storeReviews.reduce((acc, curr) => acc + curr.rating, 0) / storeReviews.length;
      await prisma.store.update({
        where: { id: review.storeId },
        data: { rating: parseFloat(avgRating.toFixed(1)) }
      });
    }

    revalidatePath("/profile/reviews");
    return { success: true, review: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Xóa đánh giá
 */
export async function deleteReview(reviewId: string) {
  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId }, select: { storeId: true } });
    await prisma.review.delete({ where: { id: reviewId } });

    // Recalculate store rating
    if (review) {
      const storeReviews = await prisma.review.findMany({
        where: { storeId: review.storeId },
        select: { rating: true }
      });
      const avgRating = storeReviews.length > 0 
        ? storeReviews.reduce((acc, curr) => acc + curr.rating, 0) / storeReviews.length 
        : 0;
      
      await prisma.store.update({
        where: { id: review.storeId },
        data: { rating: parseFloat(avgRating.toFixed(1)) }
      });
    }

    revalidatePath("/profile/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Lấy danh sách đánh giá của một người dùng
 */
export async function getUserReviews(userId: string) {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      store: {
        select: {
          name: true,
          imageUrl: true,
        }
      },
      order: {
        include: {
          items: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * Lấy thống kê đánh giá của người dùng (e.g. tổng số đánh giá, điểm trung bình đã cho)
 */
export async function getUserReviewStats(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { userId },
    select: { rating: true }
  });

  const total = reviews.length;
  const avg = total > 0 
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / total 
    : 0;

  return {
    total: total,
    average: parseFloat(avg.toFixed(1))
  };
}

/**
 * Lấy thống kê đánh giá của một cửa hàng
 */
export async function getStoreReviewStats(storeId: string) {
  const reviews = await prisma.review.findMany({
    where: { storeId },
    select: { rating: true }
  });

  const total = reviews.length;
  const avg = total > 0 
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / total 
    : 0;

  // Calculate distribution (1-5 star counts)
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  return {
    count: total,
    average: parseFloat(avg.toFixed(1)),
    distribution
  };
}
