"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

export async function registerUser(data: {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email đã được sử dụng!");
  }

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

  const newUser = await prisma.user.create({
    data: {
      name: data.fullName,
      email: data.email,
      password: hashedPassword,
      phone: data.phone || undefined,
      role: UserRole.BUYER,
    },
  });

  return newUser;
}

export async function updateUserProfile(userId: string, data: { name?: string; phone?: string; avatarUrl?: string }) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
    },
  });

  // Đồng bộ (Sync) dữ liệu sang Store nếu người dùng là Merchant
  const existingStore = await prisma.store.findUnique({
    where: { ownerId: userId },
  });

  if (existingStore) {
    await prisma.store.update({
      where: { ownerId: userId },
      data: {
        name: data.name ?? existingStore.name,
        imageUrl: data.avatarUrl ?? existingStore.imageUrl,
      },
    });
  }

  return updatedUser;
}

/**
 * Upload image to Cloudinary and update user's avatar
 */
export async function uploadAvatar(userId: string, base64Image: string) {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "avatars",
      resource_type: "auto",
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: uploadResponse.secure_url },
    });

    // Đồng bộ Avatar sang Cửa hàng (Store)
    const existingStore = await prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (existingStore) {
      await prisma.store.update({
        where: { ownerId: userId },
        data: { imageUrl: uploadResponse.secure_url },
      });
    }

    return { success: true, avatarUrl: updatedUser.avatarUrl };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error.message || "Không thể tải ảnh lên");
  }
}

/**
 * Change user password
 */
export async function changeUserPassword(userId: string, data: { oldPass: string; newPass: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.password) {
    throw new Error("Người dùng không tồn tại hoặc không có mật khẩu thiết lập.");
  }

  const isPasswordValid = await bcrypt.compare(data.oldPass, user.password);
  if (!isPasswordValid) {
    throw new Error("Mật khẩu cũ không chính xác.");
  }

  const hashedPassword = await bcrypt.hash(data.newPass, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export async function switchUserRole(userId: string, newRole: "BUYER" | "MERCHANT") {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  if (newRole === "MERCHANT") {
    // Kiem tra xem User da co Store chua
    const existingStore = await prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!existingStore) {
      await prisma.store.create({
        data: {
          name: updatedUser.name ? `Cửa hàng của ${updatedUser.name}` : "Cửa hàng Mới",
          address: "123 Địa chỉ mặc định",
          lat: 10.7769, // Default coordinates for Ho Chi Minh City
          lng: 106.7009,
          imageUrl: updatedUser.avatarUrl || null,
          ownerId: userId,
        },
      });
    }
  }

  return updatedUser;
}

export async function getUserGreenStats(userId: string) {
  const orders = await prisma.order.findMany({
    where: { 
      buyerId: userId,
      status: "PICKED_UP" 
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  let totalItemsCount = 0;
  let totalSavings = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      totalItemsCount += item.quantity;
      // Money saved = (Original Price - Price Paid) * Quantity
      totalSavings += (item.product.originalPrice - item.unitPrice) * item.quantity;
    });
  });

  // Giả định trung bình 1 món đồ ăn nặng 0.5kg
  const foodSavedKg = totalItemsCount * 0.5;
  
  // 1kg thực phẩm tránh lãng phí giảm khoảng 2.5kg khí thải CO2 CO2e
  const co2ReducedKg = foodSavedKg * 2.5;

  // Thuật toán tính hạng (Rank)
  let rank = "Mầm xanh";
  let level = 1;

  if (foodSavedKg >= 50) {
    rank = "Chiến binh Xanh";
    level = 4;
  } else if (foodSavedKg >= 20) {
    rank = "Người gieo mầm";
    level = 3;
  } else if (foodSavedKg >= 5) {
    rank = "Lá non";
    level = 2;
  } else {
    rank = "Mầm xanh";
    level = 1;
  }

  return {
    foodSavedKg,
    co2ReducedKg,
    totalSavings,
    rank,
    level,
    totalOrders: orders.length
  };
}
/**
 * Request password reset OTP
 */
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Email không tồn tại trong hệ thống.");

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await prisma.user.update({
    where: { email },
    data: {
      resetOtp: otp,
      resetOtpExpiry: expiry,
    },
  });

  // In a real app, send email here. For demo, we'll just log it.
  console.log(`OTP for ${email}: ${otp}`);
  return { success: true, message: "Mã OTP đã được gửi đến email của bạn." };
}

/**
 * Verify OTP
 */
export async function verifyResetOtp(email: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Email không hợp lệ.");

  if (!user.resetOtp || user.resetOtp !== otp) {
    throw new Error("Mã OTP không chính xác.");
  }

  if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
    throw new Error("Mã OTP đã hết hạn.");
  }

  return { success: true };
}

/**
 * Reset password with OTP
 */
export async function resetPasswordWithOtp(email: string, otp: string, newPass: string) {
  const verification = await verifyResetOtp(email, otp);
  if (!verification.success) return verification;

  const hashedPassword = await bcrypt.hash(newPass, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpiry: null,
    },
  });

  return { success: true };
}
