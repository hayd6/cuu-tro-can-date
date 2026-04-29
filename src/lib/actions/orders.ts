"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentMethod, OrderStatus } from "@prisma/client";

/**
 * Tạo đơn hàng mới sau khi checkout
 */
export async function createOrder(data: {
  buyerId: string;
  storeId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  paymentMethod: string;
  momoPayUrl?: string;
  momoTransId?: string;
}) {
  const totalAmount = data.unitPrice * data.quantity;
  const orderCode = `CT-${Math.floor(100000 + Math.random() * 900000)}`;
  const pickupCode = `${Math.floor(100000 + Math.random() * 900000)}`;

  const order = await prisma.order.create({
    data: {
      orderCode,
      totalAmount,
      paymentMethod: data.paymentMethod as PaymentMethod,
      paymentStatus:
        data.paymentMethod === "COD" ? "UNPAID" : "PAID",
      status:
        data.paymentMethod === "COD"
          ? OrderStatus.CONFIRMED
          : OrderStatus.CONFIRMED,
      pickupCode,
      momoPayUrl: data.momoPayUrl,
      momoTransId: data.momoTransId,
      buyerId: data.buyerId,
      storeId: data.storeId,
      items: {
        create: {
          productId: data.productId,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
        },
      },
    },
    include: {
      items: true,
      store: true,
    },
  });

  // Giảm số lượng tồn kho
  await prisma.product.update({
    where: { id: data.productId },
    data: {
      quantityLeft: { decrement: data.quantity },
    },
  });

  // Cập nhật trạng thái SOLD_OUT nếu hết hàng
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { quantityLeft: true },
  });
  if (product && product.quantityLeft <= 0) {
    await prisma.product.update({
      where: { id: data.productId },
      data: { status: "SOLD_OUT" },
    });
  }

  revalidatePath("/orders");
  revalidatePath("/merchant/orders");

  // Gửi thông báo cho Người Mua
  await prisma.notification.create({
    data: {
      userId: data.buyerId,
      title: "Đặt hàng thành công",
      message: `Đơn hàng <b>${orderCode}</b> đã được xác nhận. Vui lòng đến lấy trước khi hết hạn.`,
      type: "ORDER",
      orderId: order.id,
    },
  });

  // Gửi thông báo cho Người Bán (Chủ cửa hàng)
  await prisma.notification.create({
    data: {
      userId: order.store.ownerId,
      title: "Có đơn hàng mới",
      message: `Khách hàng vừa đặt đơn hàng <b>${orderCode}</b>. Vui lòng chuẩn bị thực phẩm.`,
      type: "ORDER",
      orderId: order.id,
      storeId: data.storeId,
    },
  });

  return order;
}

/**
 * Lấy đơn hàng của người mua
 */
export async function getOrdersByBuyer(buyerId: string) {
  const orders = await prisma.order.findMany({
    where: { buyerId },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
          lat: true,
          lng: true,
          owner: {
            select: { phone: true }
          }
        },
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, imageUrl: true },
          },
        },
      },
      reviews: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

/**
 * Lấy đơn hàng của cửa hàng (cho merchant)
 */
export async function getOrdersByStore(storeId: string) {
  const orders = await prisma.order.findMany({
    where: { storeId },
    include: {
      buyer: {
        select: { id: true, name: true, phone: true },
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, imageUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

/**
 * Lấy chi tiết đơn hàng theo ID
 */
export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      store: true,
      buyer: { select: { id: true, name: true, phone: true } },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
}

/**
 * Merchant xác nhận đã giao hàng (PICKED_UP) bằng mã PIN
 */
export async function confirmPickupByPin(pinCode: string, storeId: string) {
  try {
    // Tìm đơn hàng có pickupCode khớp và thuộc cửa hàng này
    const order = await prisma.order.findFirst({
      where: {
        pickupCode: pinCode.replace("#", ""),
        storeId: storeId,
        status: OrderStatus.CONFIRMED,
      },
    });

    if (!order) {
      return { success: false, error: "Mã PIN không hợp lệ hoặc đơn hàng không thuộc cửa hàng này." };
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.PICKED_UP },
      include: { store: true }
    });

    // Thông báo cho Người Mua
    await prisma.notification.create({
      data: {
        userId: updated.buyerId,
        title: "Đơn hàng hoàn tất",
        message: `Đơn hàng <b>${updated.orderCode}</b> đã được giao. Cảm ơn bạn đã cứu trợ thực phẩm!`,
        type: "ORDER",
        orderId: updated.id,
      },
    });

    // Thông báo cho Người Bán
    await prisma.notification.create({
      data: {
        userId: updated.store.ownerId,
        title: "Bán hàng thành công",
        message: `Đơn hàng <b>${updated.orderCode}</b> đã được giao cho khách hàng.`,
        type: "ORDER",
        orderId: updated.id,
        storeId: updated.storeId,
      },
    });

    revalidatePath("/merchant/orders");
    revalidatePath("/orders");
    return { success: true, order: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Lỗi hệ thống" };
  }
}

/**
 * Merchant xác nhận đã giao hàng (PICKED_UP) qua QR (OrderId)
 */
export async function confirmPickup(orderId: string, storeId: string) {
  try {
    // Tìm đơn hàng khớp id và thuộc cửa hàng này
    const orderCheck = await prisma.order.findFirst({
      where: {
        id: orderId,
        storeId: storeId,
        status: OrderStatus.CONFIRMED,
      },
    });

    if (!orderCheck) {
      return { success: false, error: "Mã QR không hợp lệ hoặc đơn hàng không thuộc cửa hàng này." };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PICKED_UP },
      include: { store: true }
    });

    // Thông báo cho Người Mua
    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: "Đơn hàng hoàn tất",
        message: `Đơn hàng <b>${order.orderCode}</b> đã được giao. Cảm ơn bạn đã cứu trợ thực phẩm!`,
        type: "ORDER",
        orderId: order.id,
      },
    });

    // Thông báo cho Người Bán
    await prisma.notification.create({
      data: {
        userId: order.store.ownerId,
        title: "Bán hàng thành công",
        message: `Đơn hàng <b>${order.orderCode}</b> đã được giao cho khách hàng.`,
        type: "ORDER",
        orderId: order.id,
        storeId: order.storeId,
      },
    });

    revalidatePath("/merchant/orders");
    revalidatePath("/orders");
    return { success: true, order };
  } catch (err: any) {
    return { success: false, error: err.message || "Lỗi hệ thống" };
  }
}

/**
 * Hủy đơn hàng
 */
export async function cancelOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new Error("Không tìm thấy đơn hàng");

  // Hoàn lại số lượng
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { quantityLeft: { increment: item.quantity }, status: "AVAILABLE" },
    });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
    include: { store: true }
  });

  // Thông báo cho Người Mua
  await prisma.notification.create({
    data: {
      userId: updated.buyerId,
      title: "Đơn hàng đã bị hủy",
      message: `Đơn hàng <b>${updated.orderCode}</b> đã bị hủy.`,
      type: "ORDER",
      orderId: updated.id,
    },
  });

  // Thông báo cho Người Bán
  await prisma.notification.create({
    data: {
      userId: updated.store.ownerId,
      title: "Đơn hàng bị hủy",
      message: `Đơn hàng <b>${updated.orderCode}</b> đã bị hủy.`,
      type: "ORDER",
      orderId: updated.id,
      storeId: updated.storeId,
    },
  });

  revalidatePath("/orders");
  revalidatePath("/merchant/orders");
  return updated;
}
