"use client";

import { useState, useEffect } from "react";
import { confirmPickup } from "@/lib/actions/orders";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Product = { id: string; name: string; imageUrl: string | null };
type Buyer = { id: string; name: string | null; phone: string | null };
type OrderItem = { id: string; quantity: number; unitPrice: number; product: Product };

type Order = {
  id: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  pickupCode: string | null;
  createdAt: Date;
  buyer: Buyer;
  items: OrderItem[];
};

const STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  CONFIRMED: "Chờ lấy hàng",
  PICKED_UP: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function MerchantOrdersClient({ orders, storeId }: { orders: Order[]; storeId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "pending" | "completed" | "cancelled" | null;
  
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "cancelled">("pending");

  useEffect(() => {
    if (tabParam && ["pending", "completed", "cancelled"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const pendingOrders = orders.filter((o) => o.status === "CONFIRMED" || o.status === "PENDING");
  const completedOrders = orders.filter((o) => o.status === "PICKED_UP");
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED");

  const handleConfirmPickup = async (orderId: string) => {
    await confirmPickup(orderId, storeId);
    router.refresh();
  };

  const renderOrderList = (list: Order[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="material-symbols-outlined text-5xl text-outline-variant">receipt_long</span>
          <p className="text-on-surface-variant font-medium">Chưa có đơn hàng</p>
        </div>
      );
    }

    return list.map((order) => (
      <div
        key={order.id}
        className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] relative overflow-hidden group border border-outline-variant/10 lg:flex lg:gap-6 lg:items-stretch"
      >
        {/* Urgency glow for pending */}
        {order.status === "CONFIRMED" && (
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-tertiary-fixed/30 rounded-full blur-2xl group-hover:bg-tertiary-fixed/50 transition-all lg:hidden"></div>
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1 z-10 relative">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">{order.orderCode}</span>
                {order.status === "CONFIRMED" && (
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Cần lấy gấp</span>
                )}
              </div>
              <p className="text-on-surface-variant font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">person</span>
                {order.buyer.name} {order.buyer.phone ? `(${order.buyer.phone})` : ""}
              </p>
              {order.pickupCode && (
                <div className="flex items-center gap-2 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 w-fit">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Pin nhận hàng:</span>
                  <span className="text-sm font-black text-primary tracking-widest">#{order.pickupCode}</span>
                </div>
              )}
            </div>
            <div className="text-right z-10 relative">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Đặt lúc</p>
              <p className="font-bold text-on-surface">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")} - {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-surface-container-low rounded-xl p-4 mb-4 space-y-3 z-10 relative">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium text-sm">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="text-on-surface font-semibold text-sm">
                  {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-outline-variant/15 flex justify-between items-center">
              <div className="flex flex-col">
                <span className={`font-bold text-sm flex items-center gap-1 ${
                  (order.status === "PICKED_UP") ? "text-primary" : (order.paymentStatus !== "PAID" ? "text-error" : "text-primary")
                }`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {(order.status === "PICKED_UP" || order.paymentStatus === "PAID") ? "check_circle" : "pending"}
                  </span>
                  {(order.status === "PICKED_UP" || order.paymentStatus === "PAID") ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                  Phương thức: {order.paymentMethod === "COD" ? "Tiền mặt" : order.paymentMethod === "MOMO" ? "Ví MoMo" : order.paymentMethod}
                </span>
              </div>
              <span className="text-primary font-extrabold text-lg">
                {order.totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* Actions (Mobile Only) */}
          {order.status === "CONFIRMED" && (
            <div className="flex gap-3 z-10 relative lg:hidden mt-2">
              <Link
                href="/merchant/scan"
                className="bg-gradient-to-br from-primary to-primary-container flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                Xác nhận QR
              </Link>
              <Link
                href="/merchant/enter-code"
                className="bg-surface-container-highest text-primary flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-lg">dialpad</span>
                Nhập thủ công
              </Link>
            </div>
          )}
        </div>

        {/* Actions (Web/Desktop) */}
        {order.status === "CONFIRMED" && (
          <div className="hidden lg:flex flex-col gap-2 justify-start items-end pr-2 pt-1">
            <Link
              href="/merchant/scan"
              className="bg-gradient-to-br from-primary to-primary-container w-36 py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm"
            >
              <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              Xác nhận QR
            </Link>
            <Link
              href="/merchant/enter-code"
              className="bg-surface-container-highest text-primary w-36 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform border border-outline-variant/10"
            >
              <span className="material-symbols-outlined text-base">dialpad</span>
              Nhập thủ công
            </Link>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh] pb-32 font-body">
      <header className="w-full top-0 sticky bg-surface/90 backdrop-blur-md z-40 border-b border-surface-container lg:hidden">
        <div className="desktop-page-shell-tight flex items-center justify-center px-4 lg:px-6 py-4 w-full">
          <h1 className="font-['Inter'] font-semibold tracking-tight text-xl text-primary">Quản lý đơn hàng</h1>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-16 lg:top-0 z-40 border-b border-outline-variant/10 bg-surface-container-low lg:bg-white lg:border-b-0 lg:border-t-0">
        <div className="desktop-page-shell-tight flex items-center justify-between md:grid md:grid-cols-3 lg:flex lg:justify-start lg:gap-10 w-full px-4 lg:px-6">
          {(
            [
              { key: "pending", label: "Chờ lấy", count: pendingOrders.length },
              { key: "completed", label: "Hoàn thành", count: completedOrders.length },
              { key: "cancelled", label: "Đã hủy", count: cancelledOrders.length },
            ] as const
          ).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative py-4 flex items-center md:justify-center md:w-full gap-2 transition-colors ${
                activeTab === key
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant font-medium border-b-2 border-transparent hover:text-primary"
              }`}
            >
              {label}
              {count > 0 && (
                <span className="flex h-5 px-1.5 min-w-[20px] rounded-full bg-rose-500 text-white text-[10px] font-black items-center justify-center shadow-sm">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="desktop-page-shell-tight px-4 md:px-6 lg:px-6 xl:px-8 py-6 md:py-8 lg:py-8 space-y-6">
        {activeTab === "pending" && renderOrderList(pendingOrders)}
        {activeTab === "completed" && renderOrderList(completedOrders)}
        {activeTab === "cancelled" && renderOrderList(cancelledOrders)}
      </main>

      {/* FAB */}
      <Link
        href="/merchant/create"
        className="fixed right-6 bottom-28 lg:bottom-8 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>
    </div>
  );
}
