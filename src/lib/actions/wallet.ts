"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentType } from "@prisma/client";

/**
 * Lấy danh sách ví và ngân hàng đã liên kết của người dùng
 */
export async function getLinkedPayments(userId: string) {
  return await prisma.linkedPayment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * Liên kết một phương thức thanh toán mới (Mock)
 */
export async function linkPayment(data: {
  userId: string;
  type: "WALLET" | "BANK";
  provider: string;
  accountNumber: string;
  accountName?: string;
}) {
  try {
    const linkage = await prisma.linkedPayment.create({
      data: {
        userId: data.userId,
        type: data.type as PaymentType,
        provider: data.provider,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
      }
    });
    
    revalidatePath("/profile/wallet");
    return { success: true, data: linkage };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Tài khoản này đã được liên kết trước đó." };
    }
    return { success: false, error: error.message || "Lỗi liên kết" };
  }
}

/**
 * Hủy liên kết một phương thức
 */
export async function unlinkPayment(id: string) {
  try {
    await prisma.linkedPayment.delete({
      where: { id }
    });
    revalidatePath("/profile/wallet");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Đặt làm phương thức mặc định
 */
export async function setDefaultPayment(id: string, userId: string) {
  try {
    // Reset all others
    await prisma.linkedPayment.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
    
    // Set this one
    await prisma.linkedPayment.update({
      where: { id },
      data: { isDefault: true }
    });
    
    revalidatePath("/profile/wallet");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
