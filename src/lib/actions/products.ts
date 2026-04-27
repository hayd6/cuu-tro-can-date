"use server";

import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

/**
 * Lấy danh sách sản phẩm đang có sẵn (AVAILABLE)
 * Dùng cho /list và /page.tsx
 */
export async function getProducts(category?: string) {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.AVAILABLE,
      quantityLeft: { gt: 0 },
      ...(category && category !== "Tất cả"
        ? { category: category as any }
        : {}),
    },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
          rating: true,
          lat: true,
          lng: true,
        },
      },
    },
    orderBy: { expiryTime: "asc" },
  });

  return products;
}

/**
 * Lấy chi tiết sản phẩm theo ID
 */
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
          rating: true,
          lat: true,
          lng: true,
        },
      },
    },
  });

  return product;
}

/**
 * Merchant: tạo sản phẩm mới
 */
export async function createProduct(data: {
  storeId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  quantityTotal: number;
  expiryTime: Date;
  pickupStart?: Date;
  pickupEnd?: Date;
}) {
  const discountPercent = Math.round(
    ((data.originalPrice - data.discountPrice) / data.originalPrice) * 100
  );

  const product = await prisma.product.create({
    data: {
      storeId: data.storeId,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category as any,
      originalPrice: data.originalPrice,
      discountPrice: data.discountPrice,
      discountPercent,
      quantityTotal: data.quantityTotal,
      quantityLeft: data.quantityTotal,
      expiryTime: data.expiryTime,
      pickupStart: data.pickupStart,
      pickupEnd: data.pickupEnd,
      status: ProductStatus.AVAILABLE,
    },
  });

  return product;
}

/**
 * Merchant: lấy danh sách sản phẩm của cửa hàng
 */
export async function getProductsByStore(storeId: string) {
  const products = await prisma.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return products;
}

/**
 * Tải ảnh sản phẩm lên Cloudinary
 */
export async function uploadProductImage(base64Image: string) {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "products",
      resource_type: "auto",
    });

    return { success: true, imageUrl: uploadResponse.secure_url };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error.message || "Không thể tải ảnh lên");
  }
}

/**
 * Merchant: Cập nhật sản phẩm
 */
export async function updateProduct(
  productId: string,
  storeId: string,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    originalPrice?: number;
    discountPrice?: number;
    quantityTotal?: number; // total quantity
    expiryTime?: Date;
    pickupStart?: Date;
    pickupEnd?: Date;
    status?: ProductStatus;
  }
) {
  try {
    const existing = await prisma.product.findFirst({
      where: { id: productId, storeId: storeId }
    });
    if (!existing) return { success: false, error: "Không tìm thấy sản phẩm" };

    const originalPrice = data.originalPrice ?? existing.originalPrice;
    const discountPrice = data.discountPrice ?? existing.discountPrice;
    const discountPercent = Math.round(
      ((originalPrice - discountPrice) / originalPrice) * 100
    );

    // Calculate new quantityLeft based on how quantityTotal changes
    let quantityLeft = existing.quantityLeft;
    if (data.quantityTotal !== undefined && data.quantityTotal !== existing.quantityTotal) {
      const difference = data.quantityTotal - existing.quantityTotal;
      quantityLeft = existing.quantityLeft + difference;
      // Prevent negative stock directly from UI input though realistically we shouldn't allow reducing below sold
      if (quantityLeft < 0) quantityLeft = 0; 
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category as any,
        originalPrice,
        discountPrice,
        discountPercent,
        quantityTotal: data.quantityTotal,
        quantityLeft,
        expiryTime: data.expiryTime,
        pickupStart: data.pickupStart,
        pickupEnd: data.pickupEnd,
        status: data.status,
      }
    });

    revalidatePath("/merchant");
    revalidatePath("/merchant/listings");
    revalidatePath("/");

    return { success: true, product: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Không thể cập nhật sản phẩm" };
  }
}

/**
 * Merchant: Xóa sản phẩm
 */
export async function deleteProduct(productId: string, storeId: string) {
  try {
    const checkUser = await prisma.product.findFirst({
      where: { id: productId, storeId: storeId }
    });
    if (!checkUser) return { success: false, error: "Không tìm thấy sản phẩm" };

    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/merchant");
    revalidatePath("/merchant/listings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Không thể xóa sản phẩm" };
  }
}

/**
 * Merchant: Kết thúc sớm sản phẩm
 */
export async function endProduct(productId: string, storeId: string) {
  try {
    const checkProduct = await prisma.product.findFirst({
      where: { id: productId, storeId: storeId }
    });
    if (!checkProduct) return { success: false, error: "Không tìm thấy sản phẩm" };

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { status: ProductStatus.EXPIRED }
    });
    revalidatePath("/merchant");
    revalidatePath("/merchant/listings");
    revalidatePath("/");
    return { success: true, product: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Không thể kết thúc sản phẩm" };
  }
}

/**
 * Merchant: Đăng lại sản phẩm (Gia hạn 24h & set về trạng thái AVAILABLE)
 */
export async function repostProduct(productId: string, storeId: string) {
  try {
    const checkProduct = await prisma.product.findFirst({
      where: { id: productId, storeId: storeId }
    });
    if (!checkProduct) return { success: false, error: "Không tìm thấy sản phẩm" };

    const newExpiry = new Date();
    newExpiry.setHours(newExpiry.getHours() + 24); // default +24h

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { 
        status: ProductStatus.AVAILABLE,
        expiryTime: newExpiry
      }
    });
    revalidatePath("/merchant");
    revalidatePath("/merchant/listings");
    revalidatePath("/");
    return { success: true, product: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Không thể đăng lại sản phẩm" };
  }
}
