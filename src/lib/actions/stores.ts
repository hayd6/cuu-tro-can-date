"use server";

import { prisma } from "@/lib/prisma";

/**
 * Lấy danh sách tất cả cửa hàng đang active (cho bản đồ)
 */
export async function getStores() {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      address: true,
      lat: true,
      lng: true,
      imageUrl: true,
      rating: true,
      _count: {
        select: { products: true },
      },
      products: {
        where: { status: "AVAILABLE", quantityLeft: { gt: 0 } },
        orderBy: { discountPercent: "desc" },
        select: {
          id: true,
          name: true,
          originalPrice: true,
          discountPrice: true,
          discountPercent: true,
          quantityLeft: true,
          expiryTime: true,
          imageUrl: true,
          category: true,
        },
      },
    },
  });

  return stores;
}

/**
 * Lấy cửa hàng của merchant theo userId
 */
export async function getStoreByOwner(userId: string) {
  const store = await prisma.store.findUnique({
    where: { ownerId: userId },
    include: {
      products: {
        where: { status: "AVAILABLE" },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          products: true,
          orders: true,
        },
      },
    },
  });

  return store;
}

/**
 * Lấy thống kê dashboard của merchant (bao gồm số dư)
 */
export async function getMerchantStats(storeId: string, timeframe: "week" | "month" = "week") {
  const now = new Date();
  
  // Hôm nay
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  // Tháng này
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Tháng trước
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    pendingOrders,
    completedToday,
    totalRevenueToday,
    activeProducts,
    totalOrdersRevenue,
    totalWithdrawn,
    monthlyRevenueData,
    lastMonthRevenueData,
    lifetimeCompletedOrders,
  ] = await Promise.all([
    // Đơn đang chờ lấy
    prisma.order.count({
      where: { storeId, status: "CONFIRMED" },
    }),
    // Đơn hoàn thành hôm nay
    prisma.order.count({
      where: {
        storeId,
        status: "PICKED_UP",
        updatedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    // Tổng doanh thu hôm nay (Kiếm được hôm nay - bao gồm cả tiền mặt khi đã giao xong)
    prisma.order.aggregate({
      where: {
        storeId,
        status: "PICKED_UP",
        updatedAt: { gte: todayStart, lt: todayEnd },
      },
      _sum: { totalAmount: true },
    }),
    // Sản phẩm đang bán
    prisma.product.count({
      where: { storeId, status: "AVAILABLE" },
    }),
    // Tổng doanh thu kỹ thuật số (Chỉ các loại ví/thẻ - KHÔNG tính tiền mặt vì merchant tự giữ)
    prisma.order.aggregate({
      where: {
        storeId,
        status: "PICKED_UP",
        paymentStatus: "PAID",
        paymentMethod: { not: "COD" },
      },
      _sum: { totalAmount: true },
    }),
    // Tổng tiền đã rút thành công (COMPLETED)
    prisma.withdrawal.aggregate({
      where: {
        storeId,
        status: "COMPLETED",
      },
      _sum: { amount: true },
    }),
    // Doanh thu tháng này (Tất cả đơn đã giao)
    prisma.order.aggregate({
      where: {
        storeId,
        status: "PICKED_UP",
        updatedAt: { gte: monthStart },
      },
      _sum: { totalAmount: true },
    }),
    // Doanh thu tháng trước (Tất cả đơn đã giao)
    prisma.order.aggregate({
      where: {
        storeId,
        status: "PICKED_UP",
        updatedAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      _sum: { totalAmount: true },
    }),
    // Tổng đơn hoàn thành trọn đời
    prisma.order.count({
      where: { storeId, status: "PICKED_UP" },
    }),
  ]);

  const lifetimeRevenue = totalOrdersRevenue._sum.totalAmount || 0;
  const withdrawn = totalWithdrawn._sum.amount || 0;
  const monthlyRevenue = monthlyRevenueData._sum.totalAmount || 0;
  const lastMonthRevenue = lastMonthRevenueData._sum.totalAmount || 0;

  // Tính tăng trưởng (Growth)
  let growth = 0;
  if (lastMonthRevenue > 0) {
    growth = Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
  } else if (monthlyRevenue > 0) {
    growth = 100; // Tăng trưởng 100% nếu tháng trước không có doanh thu
  }

  const avgOrderValue = lifetimeCompletedOrders > 0 
    ? Math.round(lifetimeRevenue / lifetimeCompletedOrders) 
    : 0;

  const daysCount = timeframe === "month" ? 30 : 7;
  const startDate = new Date(todayStart);
  startDate.setDate(startDate.getDate() - (daysCount - 1));

  const historyOrders = await prisma.order.findMany({
    where: {
      storeId,
      status: "PICKED_UP",
      updatedAt: { gte: startDate }
    },
    select: {
      totalAmount: true,
      updatedAt: true
    }
  });

  const dailyStats = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dayLabel = timeframe === "week" 
      ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()]
      : d.getDate().toString();
    const dateStr = d.toDateString();
    
    const dayTotal = historyOrders
      .filter(o => new Date(o.updatedAt).toDateString() === dateStr)
      .reduce((sum, o) => sum + o.totalAmount, 0);
      
    return { label: dayLabel, value: dayTotal };
  });

  const maxDaily = Math.max(...dailyStats.map(d => d.value), 1);
  const chartData = dailyStats.map(d => ({
    label: d.label,
    height: `${Math.round((d.value / maxDaily) * 100)}%`,
    value: d.value
  }));

  return {
    pendingOrders,
    completedToday,
    revenueToday: totalRevenueToday._sum.totalAmount ?? 0,
    activeProducts,
    totalBalance: lifetimeRevenue - withdrawn,
    monthlyRevenue,
    lifetimeRevenue,
    lifetimeCompletedOrders,
    avgOrderValue,
    growth,
    chartData
  };
}

/**
 * Lấy dữ liệu chi tiết ví (lịch sử giao dịch)
 */
export async function getMerchantWalletData(storeId: string) {
  const [orders, withdrawals] = await Promise.all([
    prisma.order.findMany({
      where: { storeId, paymentStatus: "PAID" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderCode: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
      take: 20,
    }),
    prisma.withdrawal.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  // Merge và sort theo ngày
  const history = [
    ...orders.map((o) => ({
      id: o.id,
      type: "INCOME",
      title: `Đơn hàng #${o.orderCode.slice(-4).toUpperCase()}`,
      amount: o.totalAmount,
      date: o.createdAt,
      status: o.status === "PICKED_UP" ? "COMPLETED" : "PENDING",
    })),
    ...withdrawals.map((w) => ({
      id: w.id,
      type: "WITHDRAW",
      title: "Rút tiền về ngân hàng",
      amount: -w.amount,
      date: w.createdAt,
      status: w.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return history;
}

/**
 * Gửi yêu cầu rút tiền
 */
export async function requestWithdrawal(
  storeId: string,
  amount: number,
  bankInfo: string
) {
  // 1. Kiểm tra số dư
  const stats = await getMerchantStats(storeId);
  if (amount > stats.totalBalance) {
    throw new Error("Số dư không đủ để rút");
  }

  // 2. Tạo yêu cầu rút tiền
  const withdrawal = await prisma.withdrawal.create({
    data: {
      storeId,
      amount,
      bankInfo,
      status: "PENDING",
    },
  });

  return withdrawal;
}

/**
 * Geocode một địa chỉ thành tọa độ lat/lng bằng Mapbox Geocoding API
 */
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken || !address) return null;

  try {
    const query = encodeURIComponent(address);
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&country=vn&language=vi&limit=1&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const feature = data.features?.[0];
    if (!feature) return null;

    const [lng, lat] = feature.geometry.coordinates;
    return { lat, lng };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Cập nhật thông tin cửa hàng và đồng bộ sang User
 * Khi địa chỉ thay đổi, tự động geocode sang lat/lng để cập nhật vị trí trên bản đồ
 */
export async function updateStoreProfile(
  storeId: string,
  data: {
    name?: string;
    address?: string;
    phone?: string;
    imageUrl?: string;
    lat?: number;
    lng?: number;
  }
) {
  // Geocode địa chỉ nếu có thay đổi và KHÔNG có tọa độ đi kèm
  let locationUpdate: { lat?: number; lng?: number } = {};
  
  if (data.lat !== undefined && data.lng !== undefined) {
    locationUpdate = { lat: data.lat, lng: data.lng };
  } else if (data.address) {
    const coords = await geocodeAddress(data.address);
    if (coords) {
      locationUpdate = { lat: coords.lat, lng: coords.lng };
      console.log(`Geocoded "${data.address}" -> lat:${coords.lat}, lng:${coords.lng}`);
    } else {
      console.warn(`Could not geocode address: "${data.address}"`);
    }
  }

  // Cập nhật Store (bao gồm tọa độ mới nếu có)
  const updatedStore = await prisma.store.update({
    where: { id: storeId },
    data: {
      name: data.name,
      address: data.address,
      imageUrl: data.imageUrl,
      ...locationUpdate,
    },
    include: {
      owner: true,
    },
  });

  // Đồng bộ (Sync) dữ liệu sang User model để hồ sơ luôn giống nhau
  await prisma.user.update({
    where: { id: updatedStore.ownerId },
    data: {
      name: data.name ?? updatedStore.owner.name,
      phone: data.phone ?? updatedStore.owner.phone,
      avatarUrl: data.imageUrl ?? updatedStore.owner.avatarUrl,
    },
  });

  return updatedStore;
}
