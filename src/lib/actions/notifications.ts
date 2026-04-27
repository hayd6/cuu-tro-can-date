"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type NotificationType = "ORDER" | "SYSTEM" | "EMERGENCY" | "PROMOTION" | "REVIEW";

/**
 * Lấy danh sách thông báo của người dùng
 */
export async function getUserNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}

/**
 * Đếm số lượng thông báo chưa đọc
 */
export async function countUnreadNotifications(userId: string) {
  return await prisma.notification.count({
    where: { userId, isRead: false },
  });
}

/**
 * Đánh dấu một thông báo là đã đọc
 */
export async function markNotificationAsRead(id: string) {
  const notif = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/notifications");
  revalidatePath("/merchant/notifications");
  return notif;
}

/**
 * Đánh dấu tất cả thông báo của người dùng là đã đọc
 */
export async function markAllNotificationsAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/notifications");
  revalidatePath("/merchant/notifications");
}

/**
 * Tạo một thông báo mới (sử dụng trong nội bộ hệ thống)
 */
export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  orderId?: string;
  storeId?: string;
}) {
  const notif = await prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "SYSTEM",
      orderId: data.orderId,
      storeId: data.storeId,
    },
  });
  
  return notif;
}
